import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Button, Spin } from "@payconstruct/design-system";
import { OrganizationsProps } from "../../services/orgService";
// import BasicDetails from "../Profile/Components/Card/BasicDeatils";

import Styles from "./style.module.css";

interface OrgsProps {
  isLoading: boolean;
  isProfileUpdated?: boolean | undefined;
  organizations: OrganizationsProps[];
  selectedOrg?: OrganizationsProps;
  switchOrganization: (value: any) => void;
  // onFinish: (value: any) => void;
}

const Organizations: React.FC<OrgsProps> = ({
  isLoading,
  // selectedOrg,
  // isProfileUpdated,
  organizations = [],
  // onFinish,
  switchOrganization
}) => {
  const intl = useIntl();

  const [continueText] = useState<string>("Click to continue");
  const [orgs, setOrgs] = useState<OrganizationsProps[]>([]);

  useEffect(() => {
    organizations && setOrgs(organizations);
  }, [organizations]);

  // const OrbitalBanner = (
  //   <img
  //     className={Styles["org__bg--img"]}
  //     alt="Banner"
  //     src={process.env.PUBLIC_URL + "images/orbital-banner.jpg"}
  //   />
  // );

  const OrbitalIcon = (
    <img
      alt="logo"
      src={"https://brand.getorbital.com/orbital-logo.png"}
      width={"150px"}
      height={"15%"}
      style={{ margin: "-19px 0px 25px 0px" }}
    />
  );

  const getOrganizations = (orgsList: OrganizationsProps[]) => {
    return orgsList?.map((org: OrganizationsProps) => {
      return (
        <Button
          key={org?.organisationId || org?.entityId}
          size="large"
          type={
            "secondary"
            // selectedOrg?.organisationId ===
            // (org?.organisationId || org?.entityId)
            //   ? "primary"
            //   : "secondary"
          }
          style={{ marginBottom: "20px", marginTop: "20px" }}
          label={org?.registeredCompanyName || continueText}
          width="full"
          onClick={() => switchOrganization(org)}
        />
      );
    });
  };

  const getTitle = () => {
    let returnTitle = "";

    if (orgs?.length) {
      returnTitle = intl.formatMessage({ id: "optOrg" });
    }
    // if (orgs?.length === 1 && !isProfileUpdated) {
    //   returnTitle = "Update basic profile";
    // }
    // if (orgs?.length >= 2) {
    //   returnTitle = intl.formatMessage({ id: "optOrg" });
    // }
    return returnTitle;
  };

  // const searchOrgs = (event: any) => {
  //   const searchKey = event.target.value;
  //   console.log(searchKey, "searchKey");

  //   const filterOnSearchKey = orgs.filter(
  //     (org: any) =>
  //       org.name && org.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1
  //   );
  //   console.log(filterOnSearchKey, "filterOnSearchKey");
  //   setOrgs(filterOnSearchKey);
  // };

  return (
    <>
      <div className={Styles["org"]}>
        {/* <div className={Styles["org__bg"]}>{OrbitalBanner}</div> */}
        <div className={Styles["org__card--container"]}>
          <div className={Styles["org__card--wrapper"]}>
            <div className={Styles["org__card--header"]}>
              {OrbitalIcon}
              <p className={Styles["org__card--title"]}>{getTitle()}</p>
            </div>

            <Spin loading={isLoading}>
              {/* <Search
                  bordered={false}
                  label={""}
                  iconOnly={false}
                  placeholder={"Search"}
                  onChange={searchOrgs}
                /> */}
              <div className={Styles["org__list"]}>
                <div style={{ marginRight: "3px" }}>
                  {/* {orgs?.length === 1 && !isProfileUpdated ? (
                    <BasicDetails organizations={orgs} onFinish={onFinish} />
                  ) : (
                    getOrganizations(orgs)
                  )} */}
                  {getOrganizations(orgs)}
                </div>
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
};

export default Organizations;
