import { Header, Status } from "@payconstruct/design-system";

interface HeaderProps {
  headerText?: string;
  subHeaderText?: string;
  status?: boolean;
}

const HeaderRow: React.FC<HeaderProps> = ({
  headerText,
  subHeaderText,
  status
}) => {
  return (
    <>
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "-2px", marginRight: "7px" }}>
          <Status
            type={status ? "approved" : "pending"}
            tooltipText={status ? "Completed" : "In Progress"}
          />
        </div>
        <Header header={headerText} subHeader="" />
      </div>
      <div style={{ marginTop: "-8px" }}>
        <Header header="" subHeader={subHeaderText} />
      </div>
    </>
  );
};

export { HeaderRow };
