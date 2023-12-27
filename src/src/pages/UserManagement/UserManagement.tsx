/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useIntl } from "react-intl";
import { Menu } from "antd";
import {
  Button,
  Select,
  Search as Searcher,
  Pagination,
  Spin,
  Table,
  Icon,
  Form,
  Dropdown,
  Notification
} from "@payconstruct/design-system";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/store";
import { useDebounce } from "../../customHooks/useDebounce";
import PageWrapper from "../../components/Wrapper/PageWrapper";
import { Header, HeaderContent } from "../../components/PageHeader/Header";
import Filter from "./Components/Filter";
import {
  useGetUsersByEntityIdQuery,
  useGetUsersOnSearchQuery,
  useGetRolesQuery,
  Roles
} from "../../services/userManagementService";
import {
  updateSearchQuery,
  searchQuery as searchQueryReducer,
  updatePaginationProps,
  updateUsersFilterData,
  selectedUserFilterData,
  updateAddUserShow,
  selectedAddUserDisabled
} from "../../config/userManagement/userManagementSlice";
import { updateAccessToken } from "../../config/auth/authSlice";
import { validationOnData } from "../../config/transformer";
import { Spacer } from "../../components/Spacer/Spacer";
import { AddUser } from "./Components/Modal/AddUser/AddUser";
import { EditUser } from "./Components/Modal/EditUser";
import { ViewUser } from "./Components/Modal/ViewUser";
import { Actions } from "./Components/Modal/Actions";
import { moreInfoData } from "./UserManagementForm";
import { UserRoles } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import {
  capitalizeString,
  formatDate,
  sortData
} from "../../config/transformer";
import {
  selectOrganizationId,
  updateOrganizationToken
} from "../../config/organisation/organisationSlice";
import { useRevokeOrganisationTokenMutation } from "../../services/orgTokenService";
import {
  useResendEmailMutation,
  useResetPasswordMutation
} from "../../services/authService";
import { selectTimezone } from "../../config/general/generalSlice";
import ConfirmAddUser from "./Components/Modal/AddUser/ConfirmAddUser";
import NotificationModal from "./Components/Modal/Notification";
import style from "./style.module.css";
import { ViewRoleModal } from "./Components/Modal/ViewRoles/ViewRoles";
import { UserRolesHeader } from "./UserManagement.Interface";
import { User } from "../../services/userService";
import { ActionTypes } from "@payconstruct/fe-utils/dist/Enum/userManagementEnums";
import { audience } from "../../config/variables";
import { useCheckPermissions } from "../../customHooks/useCheckPermissions";
import { formatRoleText, sortRolesOrder } from "../Trades/Helpers/roles";

const UserManagement: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { getAccessTokenWithPopup } = useAuth0();

  const { userRole } = useCheckPermissions();

  const timeZone: string = useAppSelector(selectTimezone);
  const accessToken = useAppSelector((state) => state.auth.token);
  const [searchValue, setSearchValue] = useState<string>("");
  const [showFilter, setToggleFilter] = useState<boolean>(false);
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);
  const [showViewUserModal, setShowViewUserModal] = useState<boolean>(false);
  const [showActionsModal, setShowActionsModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<any>();
  const noData = "---";
  const [onselectRole, setRole] = useState<Roles>({
    id: "",
    createdAt: "",
    updatedAt: "",
    description: "",
    isDefault: false,
    isInternal: false,
    name: "",
    permissions: []
  });

  /* Global State */
  const paginationProps = useAppSelector(
    (state) => state.userManagement.paginationProps
  );
  const entityId = useAppSelector((state) => state.auth.clientId);
  const addUserShow = useAppSelector(
    (state) => state.userManagement.addUserShow
  );
  const searchQuery = useAppSelector(searchQueryReducer);
  const isAddUserBtnDisabled = useAppSelector(selectedAddUserDisabled);
  const appliedUserFilters = useAppSelector(selectedUserFilterData);
  // const role = useAppSelector(selectRole);
  const organisationId = useAppSelector(selectOrganizationId);

  /* Api call payload */
  const [searchPayload, setSearchPayload] = useState<Record<string, string>>({
    query: ""
  });

  /* state to preventing the useEffect calling when component remounts */
  const [isDataPreserved, setIfDataPreserved] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [showRoleDescription, setShowRoleDescription] =
    useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleSearchValue, setRoleSearchValue] = useState<string>("");
  const [selectFilterRole, setSelectFilterRole] = useState<string>("");

  const [resendEmailLink, { isLoading: isEmailSentLoading }] =
    useResendEmailMutation();
  const [revokeOrgToken] = useRevokeOrganisationTokenMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();

  /* formatting args for API call */
  const args = {
    ...paginationProps,
    ...appliedUserFilters,
    roles: selectFilterRole,
    entityId
  };

  /* Get user roles */
  const { roles } = useGetRolesQuery("GET_ROLES", {
    refetchOnMountOrArgChange: true,
    selectFromResult: ({ data }) => ({
      roles: data?.data?.role ? data.data.role?.slice()?.sort(sortData) : []
    })
  });

  /* Users By EntityID Api Query */
  const {
    response,
    totalListLength,
    refetch: getUsersByEntityIDList,
    isUsersLoading,
    isUserFetching
  } = useGetUsersByEntityIdQuery(args, {
    refetchOnMountOrArgChange: true,
    skip: showFilter === true,
    selectFromResult: ({
      data,
      isLoading,
      isSuccess,
      isError,
      isFetching
    }) => ({
      response: data?.data?.users ? data.data.users : [],
      totalListLength: data?.data?.total,
      isUsersLoading: isLoading,
      isUserFetching: isFetching,
      isSuccess,
      isError
    })
  });

  /* Users Api Query on Search */
  const {
    refetch: getUsersOnSearch,
    usersOnSearchResponse,
    isUserSearchLoading,
    totalSearchList
  } = useGetUsersOnSearchQuery(searchPayload, {
    refetchOnMountOrArgChange: true,
    selectFromResult: ({
      data,
      isLoading,
      isSuccess,
      isError,
      isFetching
    }) => ({
      usersOnSearchResponse: data?.data?.users ? data.data.users : [],
      totalSearchList: data?.data?.total,
      isUserSearchLoading: isLoading,
      isSuccess,
      isError,
      isFetching
    }),
    skip: searchPayload.query === "" || isDataPreserved
  });

  useEffect(() => {
    if (!!searchQuery) {
      shiftAccountToFirst();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shiftAccountToFirst = () => {
    setIfDataPreserved(false);
  };

  /* when user starts typing adding a delay and update the state */
  useDebounce(
    () => {
      if (searchValue) {
        setSearchPayload({
          query: searchValue
        });
      }
    },
    350,
    [searchValue]
  );

  useDebounce(
    () => {
      if (roleSearchValue) {
        setSelectFilterRole(roleSearchValue);
      }
    },
    400,
    [roleSearchValue]
  );

  useEffect(() => {
    if (showAddUserModal) {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddUserModal, form]);

  const resendEmail = async (email: string) => {
    try {
      await resendEmailLink({
        email
      })
        .unwrap()
        .then(() => {
          Notification({
            message: "The invite has been resent to the user",
            description:
              "An email invitation has been sent to the user on their listed email address. ",
            type: "success"
          });
        });
    } catch (err) {
      Notification({
        message: "There was an error in resending the invite",
        description:
          "We apologise for the inconvenience. Please get in touch with your customer service representative.",
        type: "warning"
      });
    }
  };

  const getTotalCount = () => {
    return searchValue ? totalSearchList : totalListLength;
  };

  const getUsers = () => {
    return !searchValue || !searchQuery
      ? response ?? []
      : usersOnSearchResponse ?? [];
  };

  const handleMenuClick = (e: any, record: User) => {
    setActionType(e.key);
    setSelectedRecord(record);
    if (e.key === ActionTypes.InviteUser) {
      resendEmail(record?.email);
    } else if (e.key === ActionTypes.ResetPassword) {
      getAccessTokenPopup(record, "Reset Password");
    } else setShowActionsModal(true);
  };

  const getAccessTokenPopup = async (userRecord: User, actionType: string) => {
    dispatch(updateOrganizationToken(accessToken));
    const token = await getAccessTokenWithPopup({
      organization: organisationId,
      audience: audience,
      ignoreCache: true,
      portal: "cms"
    });
    await dispatch(
      updateAccessToken({
        token,
        refreshToken: ""
      })
    );
    if (token && actionType === ActionTypes.ResetPassword) {
      passwordChange(userRecord?.email);
    }
  };

  const passwordChange = async (email: string) => {
    try {
      await resetPassword({
        email
      })
        .unwrap()
        .then(() => {
          revokeOrgToken();
          Notification({
            message: "The user has been sent a password reset link",
            description:
              "An email password reset link has been sent to the user on their listed email address.",
            type: "success"
          });
        });
    } catch (err: any) {
      Notification({
        message: "Error in changing the user’s password",
        description:
          "We apologise for the inconvenience. Please get in touch with your customer service representative.",
        type: "warning"
      });
    }
  };

  const handleViewUserDetails = (id: string) => {
    setSelectedUserId(id);
    setShowViewUserModal(true);
  };

  const MoreInfoData = useMemo(() => {
    if (moreInfoData)
      return moreInfoData?.map((data: UserRolesHeader) => {
        return <Menu.Item key={data?.name}>{data?.name}</Menu.Item>;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreInfoData]);

  const getRolesByValidation = (roles: Roles[]) => {
    const superAdminRoles = roles.filter(
      (item: Roles) => item?.name !== UserRoles.SuperAdmin
    );
    const adminRoles = roles.filter(
      (item: Roles) =>
        item?.name !== UserRoles.SuperAdmin && item?.name !== UserRoles.Admin
    );
    return userRole === UserRoles.SuperAdmin ? superAdminRoles : adminRoles;
  };

  const menu = (record: User, userRole: string) => {
    const filterSuperRoles = (roles || []).filter(
      (role: Roles) =>
        role?.name !== UserRoles.SuperAdmin && role?.name !== record.role
    );
    const filteradminRoles = filterSuperRoles.filter(
      (role: Roles) => userRole === UserRoles.Admin && role?.name !== userRole
    );
    const filterRoles =
      userRole === UserRoles.SuperAdmin ? filterSuperRoles : filteradminRoles;
    let returnMenu;

    returnMenu = (
      <Menu style={{ borderRadius: "10px", padding: "5px" }}>
        {filterRoles?.map((item: Roles) => {
          return (
            <Menu.Item
              key={item.id}
              onClick={() => {
                setSelectedRecord(record);
                setRole(item);
                setShowEditUserModal(true);
              }}
            >
              {formatRoleText(item.name)}
            </Menu.Item>
          );
        })}
      </Menu>
    );
    return returnMenu;
  };

  const getRolesList = (record: User, userRole: string) => {
    return (
      <Dropdown
        overlay={menu(record, userRole)}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Button
          type="link"
          icon={{ name: "dropdown", position: "right" }}
          label={record?.role && formatRoleText(record?.role)}
        />
      </Dropdown>
    );
  };

  const logInUser = (userRole: string, record: User) => {
    switch (userRole) {
      case UserRoles.SuperAdmin:
        return record.role === userRole ? (
          <>{capitalizeString(record?.role)} </>
        ) : (
          getRolesList(record, userRole)
        );
      case UserRoles.Admin:
        return record.role === UserRoles.Creator ||
          record.role === UserRoles.Viewer ||
          record.role === UserRoles.Admin ? (
          getRolesList(record, userRole)
        ) : (
          <>{record?.role && formatRoleText(record?.role)}</>
        );
    }
  };

  const moreInfoAccess = (Role: string, record: User) => {
    switch (Role) {
      case UserRoles.SuperAdmin:
        return record.role !== UserRoles.SuperAdmin;
      case UserRoles.Admin:
        return (
          record.role === UserRoles.Admin ||
          record.role === UserRoles.Creator ||
          record.role === UserRoles.Viewer
        );
      case UserRoles.Creator:
        return userRole !== UserRoles.Creator;
      // return !userRole.includes(UserRoles.Creator);
      case UserRoles.Viewer:
        return userRole !== UserRoles.Viewer;
      // return !userRole.includes(UserRoles.Viewer);
    }
  };

  /* Table Columns */
  const columns = [
    {
      key: "name",
      title: "Name",
      dataIndex: "firstName",
      render: (_: void, record: User, index: number) => {
        return (
          validationOnData(record, "array") && (
            <div key={index}>
              {record.firstName && record.lastName ? (
                <div style={{ color: "#49718F", display: "flex" }}>
                  <span>
                    <Button
                      type="link"
                      size="small"
                      label={record.firstName + " " + record.lastName}
                      onClick={() => handleViewUserDetails(record?.id)}
                    />
                  </span>
                </div>
              ) : (
                noData
              )}
            </div>
          )
        );
      }
    },
    {
      key: "email",
      title: "Email",
      dataIndex: "email",
      render: (_: void, record: User) => {
        return (
          <div onClick={() => handleViewUserDetails(record?.id)}>
            {record.email}
          </div>
        );
      }
    },
    {
      key: "lastLogin",
      title: "Last active",
      dataIndex: "lastLogin",
      render: (_: void, record: User) => {
        return (
          <div onClick={() => handleViewUserDetails(record?.id)}>
            {formatDate(record.lastActive, timeZone)}
          </div>
        );
      }
    },
    {
      dataIndex: "role",
      key: "role",
      title: "Role",
      render: (_index: number, record: User) => {
        return (
          <div style={{ cursor: "pointer" }}>
            {userRole === UserRoles.Creator ||
            userRole === UserRoles.Viewer ||
            userRole === UserRoles.ECommerceViewer ? (
              <>{record?.role && formatRoleText(record.role)}</>
            ) : (
              logInUser(userRole, record)
            )}
          </div>
        );
      }
    },
    {
      title: "",
      dataIndex: "icon",
      key: "action",
      width: "50px",
      render: (_: void, record: User) => (
        <>
          {validationOnData(record, "array") &&
            moreInfoAccess(userRole, record) && (
              <div style={{ cursor: "pointer" }}>
                <Dropdown
                  arrow={true}
                  placement={"bottomLeft"}
                  overlay={
                    <Menu
                      style={{ borderRadius: "10px", padding: "5px" }}
                      onClick={(e) => handleMenuClick(e, record)}
                    >
                      {MoreInfoData}
                    </Menu>
                  }
                >
                  <Icon name="more" />
                </Dropdown>
              </div>
            )}
        </>
      )
    }
  ];

  /* On Filter changes */
  const handleOnFilterClose = () => {
    setToggleFilter(false);
  };

  const handleFilterOnSubmit = (values: any) => {
    // console.log("handleFilterOnSubmit");
    /*
        Updating the Filter Data
      */
    dispatch(updateUsersFilterData(values));
    /* 
        Updating the Pagination Properties
      */
    dispatch(updatePaginationProps({ current: 1, pageSize: 10 }));
    /* 
      Calling the api
    */
    dispatch(updateSearchQuery(values.email));
    // setSearchValue(values.email);

    setToggleFilter(false);
  };

  /* On Pagination changes */
  const handlePaginationChange = (
    current: number,
    pageSize: number | undefined
  ) => {
    dispatch(updatePaginationProps({ current, pageSize }));
  };

  const handleOnType = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateSearchQuery(value));
    setSearchValue(value);
  };

  const toRolesOptionFormat = (roles: Roles[]) => {
    return roles?.sort(sortRolesOrder)?.map((option: Roles) => {
      return [option.id, formatRoleText(option.name)];
    });
  };

  const roleTypeOptions: any = useMemo(() => {
    return toRolesOptionFormat(roles);
  }, [roles]);

  const onChangeRoleHandler = (roles: any) => {
    roles.length
      ? setRoleSearchValue(String(roles))
      : setSelectFilterRole(String(roles));
  };

  return (
    <div className="table__wrapper">
      <ConfirmAddUser
        refetchUserList={getUsersByEntityIDList}
        role={selectedRole}
      />
      <NotificationModal />
      <PageWrapper>
        <Header>
          <HeaderContent.LeftSide>
            <HeaderContent.Title>User Management</HeaderContent.Title>
            {userRole !== UserRoles.Creator &&
              userRole !== UserRoles.Viewer &&
              userRole !== UserRoles.ECommerceViewer && (
                <div className={style["add__newUser-btn"]}>
                  <Button
                    type="primary"
                    label="New User"
                    onClick={() => dispatch(updateAddUserShow(true))}
                    disabled={isAddUserBtnDisabled}
                    icon={{
                      name: "add",
                      position: "left"
                    }}
                  />
                </div>
              )}
          </HeaderContent.LeftSide>
          <HeaderContent.RightSide>
            <Button
              type={"tertiary"}
              label={"View Roles"}
              style={{ marginTop: "-40px" }}
              onClick={() => {
                setShowRoleDescription(true);
              }}
            />
            <ViewRoleModal
              title={"User Roles"}
              show={showRoleDescription}
              onClickOk={() => {
                setShowRoleDescription(false);
              }}
              onOkText={"Done"}
            />
          </HeaderContent.RightSide>
        </Header>
        <Filter
          allUsers={[]}
          initialData={appliedUserFilters}
          toggleDrawer={showFilter}
          onClose={handleOnFilterClose}
          onSubmit={handleFilterOnSubmit}
        />

        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "73%" }}>
            <Searcher
              bordered={true}
              style={{ height: "auto" }}
              onChange={handleOnType}
              onClear={() => {
                dispatch(updateSearchQuery(""));
                setSearchValue("");
              }}
            />
          </div>
          <div style={{ width: "25%", marginLeft: "25px" }}>
            <Select
              label={"Filter"}
              placeholder={"Filter by role"}
              mode="multiple"
              optionlist={roleTypeOptions}
              onChange={onChangeRoleHandler}
            />
          </div>
        </div>

        <Spacer size={24} />
        <Spin
          loading={
            isResetPasswordLoading ||
            isEmailSentLoading ||
            isUserSearchLoading ||
            isUsersLoading ||
            isUserFetching
          }
        >
          <Table
            rowKey={(record) => record.id}
            scroll={{ x: true }}
            dataSource={getUsers()}
            tableColumns={columns}
            pagination={false}
            tableSize="medium"
          />
        </Spin>
        <Spacer size={24} />
        <Pagination
          {...paginationProps}
          showSizeChanger
          pageSizeOptions={["10", "25", "50", "100"]}
          total={getTotalCount()}
          showTotal={(total: number, range: any) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          onChange={handlePaginationChange}
        />
        {showViewUserModal && (
          <ViewUser
            show={showViewUserModal}
            userId={selectedUserId}
            handleCloseViewModal={() => {
              setShowViewUserModal(false);
            }}
          />
        )}
        <AddUser
          show={addUserShow}
          title={"Add New User"}
          form={form}
          roles={getRolesByValidation(roles)}
          onCancelText={intl.formatMessage({ id: "cancel" })}
          onOkText={"Send invite"}
          toggleShow={(value) => setShowAddUserModal(value)}
          onClickCancel={() => {
            setShowAddUserModal(false);
            dispatch(updateAddUserShow(false));
          }}
          onClickOk={() => {
            setShowAddUserModal(false);
          }}
          refetchUserList={getUsersByEntityIDList}
          onChangeHandler={(value: string) => {
            const role = roles
              .filter((item: Roles) => item?.id === value)
              .map((data: Roles) => {
                return data.name;
              });
            setSelectedRole(role.toString());
          }}
        />
        {showEditUserModal && (
          <EditUser
            show={showEditUserModal}
            title={`Confirm change of user’s role to ${onselectRole.name}`}
            form={form}
            roles={roles}
            onCancelText={intl.formatMessage({ id: "cancel" })}
            onOkText={"Change Role"}
            userId={selectedRecord?.id ? selectedRecord.id : ""}
            selectedrole={onselectRole}
            toggleShow={(value) => setShowEditUserModal(value)}
            onClickCancel={() => {
              setShowEditUserModal(false);
              form.resetFields();
            }}
            onClickOk={() => {
              setShowEditUserModal(false);
            }}
            refetchUserList={getUsersByEntityIDList}
          />
        )}
        <Actions
          show={showActionsModal}
          title={actionType}
          userRecord={selectedRecord}
          toggleShow={(value: boolean) => setShowActionsModal(value)}
          refetchUserList={() => {
            getUsersByEntityIDList();
            getUsersOnSearch();
          }}
        />
      </PageWrapper>
    </div>
  );
};

export { UserManagement as default };
