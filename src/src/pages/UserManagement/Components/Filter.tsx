import React from "react";
import {
  Drawer,
  Header,
  Text,
  Form,
  Select,
  Button
} from "@payconstruct/design-system";
import { useAppDispatch } from "../../../redux/hooks/store";
import { updateUsersFilterData } from "../../../config/userManagement/userManagementSlice";

/**
 *
 *  @component users Filter
 *
 *  @param toggleDrawer Show / Hide Filter Drawer.
 *  @param onSubmit  Callback function when user clicks on submit btn.
 *  @param onClose   Callback function when user clicks on Cancel btn, it's will clear the filtered data and refetch the initial data.
 *
 *  @returns null
 */

interface IClientsFilterProps {
  allUsers: any[];
  toggleDrawer: boolean;
  initialData: { [key: string]: string };
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const UsersFilter: React.FC<IClientsFilterProps> = ({
  allUsers,
  toggleDrawer = false,
  initialData,
  onSubmit,
  onClose
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const getDrawerContent = () => {
    let emailOptions: any = [];
    /* Extracting the email Id for filter dropdown list data. */

    for (let i = 0; i < allUsers.length; i++) {
      const current = allUsers[i];
      /* Getting Email */
      if (current?.email && current?.email !== "") {
        emailOptions.push([current?.id, current?.email]);
      }
    }

    const handleOnClose = () => {
      form.resetFields();
      onClose();
    };

    return (
      <>
        <Form
          id="myFrom"
          form={form}
          initialValues={initialData}
          onFinish={(formData: any) => onSubmit(formData)}
        >
          <div className="filter__header">
            <Header header="Filter" subHeader="" />
            <div
              onClick={() => {
                dispatch(updateUsersFilterData({}));
                form.resetFields();
              }}
              style={{ cursor: "pointer" }}
            >
              <Text label="Clear all" size="default" />
            </div>
          </div>
          <div className="filter__main pt-3">
            <Form.Item name="userId">
              <Select
                label="Email"
                optionlist={emailOptions}
                placeholder="Select"
                optionFilterProp="children"
              />
            </Form.Item>
          </div>
          <div className="filter__footer">
            <Button
              className="cancel__filter-btn"
              label="Cancel"
              type="secondary"
              onClick={handleOnClose}
            />
            <Button
              label="See Results"
              type="primary"
              formType="submit"
              onClick={() => {
                form.submit();
                // form.resetFields();
              }}
            />
          </div>
        </Form>
      </>
    );
  };

  return (
    <Drawer visible={toggleDrawer} closable={false} width={400}>
      {getDrawerContent()}
    </Drawer>
  );
};

export default UsersFilter;
