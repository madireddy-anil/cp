import React from "react";
import { Text } from "@payconstruct/design-system";
// import { useRevokeOrganisationTokenMutation } from "../../services/orgTokenService";

const OrbitalLoader: React.FC = () => {
  // const [revokeOrgToken] = useRevokeOrganisationTokenMutation();

  // useEffect(() => {
  //   revokeOrgToken();
  // }, [revokeOrgToken]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <img
          src={process.env.PUBLIC_URL + "images/orbital-icon.png"}
          alt="Orbital"
          width={50}
          height={50}
          style={{ marginBottom: "10px" }}
        />
        <br />
        <Text size="small" label="Orbital loading..." />
      </div>
    </div>
  );
};

export default OrbitalLoader;
