import React from "react";
import { Row, Col } from "antd";
import {
  Form,
  Button,
  Accordions,
  Text,
  Select,
  Input,
  Tooltip
} from "@payconstruct/design-system";
import { Spacer } from "../../../../components/Spacer/Spacer";
import { useAppSelector } from "../../../../redux/hooks/store";
import UploadLicense from "./uploadLicense";

interface LicenseCardProps {
  allLicenseForUI: any;
  isAddLicenseEnabled: boolean;
  licenseCardData: LicenceCardData;
  handleAddLicense: () => void;
  onClickCardDeleteHandler: (license: { header: string; key: string }) => void;
  onClickNewCardDeleteHandler: () => void;
  onChangelicenseTypeHandler: (e: any) => void;
  onChangeLicenceCountryHandler: (e: any) => void;
  onLicenseHolderNameChange: (e: any) => void;

  unableToProvideLicense: (e: any) => void;
  updateClientLicenses: (values: any) => void;
  onUpload: () => void;
  onDocumentUploadSuccess: () => void;
}

interface LicenceCardData {
  licenseType: any[];
  regulatoryCountry: any[];
  licenseHolderName: string;
  reason: string;
  comments: string;
}

const LicenseCard: React.FC<LicenseCardProps> = (props) => {
  const AddNewLicense = Accordions;
  const SelectedLicenseList = Accordions;
  const {
    allLicenseForUI,
    isAddLicenseEnabled,
    licenseCardData,
    handleAddLicense,
    onClickCardDeleteHandler,
    onClickNewCardDeleteHandler,
    onChangelicenseTypeHandler,
    onChangeLicenceCountryHandler,
    onLicenseHolderNameChange,
    updateClientLicenses,
    onUpload,
    onDocumentUploadSuccess
    // unableToProvideLicense
  } = props;

  const { licenseTypeOptions, countriesOptions } = useAppSelector(
    (state) => state.regulatoryInformation
  );

  const headerContent = (
    <Row justify="space-between" style={{ marginBottom: "25px" }}>
      <Col>
        <Text weight="regular" size="medium" label="Upload your license" />
      </Col>
      <Col hidden={allLicenseForUI?.length === 0}>
        <Tooltip text="Add as many licences as relevant to your application using this button">
          <Button
            type="link"
            size="small"
            formType="button"
            label="Add Licence"
            icon={{ name: "add", position: "left" }}
            style={{ marginLeft: "12px", marginTop: "-3px" }}
            onClick={handleAddLicense}
          />
        </Tooltip>
      </Col>
      <Text
        weight="lighter"
        size="small"
        label="Each application must have at least one license type and location"
      />
    </Row>
  );
  const addLicenseForUI = [
    {
      id: 989,
      header: "Individual Licence Information",
      unCollapse: true,
      headerRight: true,
      text: (
        <Form>
          <div key="add-new-licence">
            <div style={{ marginBottom: "20px" }}>
              <Select
                label={"License type"}
                placeholder={"Select Options"}
                optionlist={licenseTypeOptions}
                onChange={onChangelicenseTypeHandler}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <Select
                showSearch
                label="Country"
                optionlist={countriesOptions}
                onChange={onChangeLicenceCountryHandler}
                optionFilterProp="children"
                filterOption={(input: any, option: any | undefined) =>
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              />
            </div>
            {licenseCardData.licenseType[0] === "sub_license" && (
              <div style={{ marginBottom: "20px" }}>
                <Input
                  name="licenseHolderName"
                  type="text"
                  size="large"
                  label="Principal license holder legal name"
                  //required
                  style={{ width: "100%" }}
                  onChange={onLicenseHolderNameChange}
                />
              </div>
            )}
            <Text label="Upload a copy of your license" />
            <Spacer size={15} />
            <div>
              <Tooltip text="If you have stated 'Pending license application' above then upload proof here">
                <UploadLicense
                  licenseType={licenseCardData.licenseType[0]}
                  regulatoryContry={licenseCardData.regulatoryCountry[0]}
                  licenseHolderName={licenseCardData.licenseHolderName}
                  isLicenseTypeCountryUpdated={
                    !licenseCardData?.licenseType[0] &&
                    !licenseCardData?.regulatoryCountry[0]
                  }
                  updateClientLicenses={updateClientLicenses}
                  onUpload={onUpload}
                  onDocumentUploadSuccess={onDocumentUploadSuccess}
                />
              </Tooltip>
              <Tooltip text="Please access the live chat window for support">
                <Button
                  width="full"
                  style={{ marginTop: "15px" }}
                  type="link"
                  size="small"
                  label="I am not able to provide this document"
                  // onClick={unableToProvideLicense}
                />
              </Tooltip>
            </div>
          </div>
        </Form>
      )
    }
  ];

  return (
    <div className="upload-licence--card-wrapper">
      <SelectedLicenseList
        header=""
        text=""
        headerContent={headerContent}
        accordionType="list"
        accordionData={allLicenseForUI}
        onClickHandler={(header: string) => {
          const licenseId = allLicenseForUI.filter(
            (item: any) => item.header === header
          )[0] as { header: string; key: string };
          onClickCardDeleteHandler(licenseId);
        }}
      />
      {isAddLicenseEnabled && (
        <AddNewLicense
          header=""
          text=""
          accordionType="list"
          accordionData={[...addLicenseForUI]}
          style={{ marginTop: "-1px", marginBottom: "35px" }}
          onClickHandler={onClickNewCardDeleteHandler}
        />
      )}
    </div>
  );
};
export default LicenseCard;
