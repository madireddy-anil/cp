import React from "react";
import { Card, Divider } from "antd";

interface ConnectionsProps {
  connections?: any[];
  handleClickConnection?: (e: any) => void;
}

const Connections: React.FC<ConnectionsProps> = ({
  connections,
  handleClickConnection
}) => {
  return (
    <>
      <Divider>or</Divider>
      <div style={{ display: "flex", textAlign: "center" }}>
        {connections?.map((connection: any) => {
          return (
            <Card
              onClick={() =>
                handleClickConnection &&
                handleClickConnection(connection?.connectionCode)
              }
              bodyStyle={{
                padding: "8px",
                margin: "0px 10px 0px 10px"
              }}
              style={{
                textAlign: "center",
                width: "50%",
                borderRadius: "7px",
                marginRight: "5px",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex" }}>
                <img
                  src={
                    process.env.PUBLIC_URL + `images/${connection.image}.png`
                  }
                  alt="Orbital"
                  style={{ marginLeft: "10%", width: "20px", height: "20px" }}
                />
                <div
                  style={{
                    marginTop: "2px",
                    fontSize: "1rem",
                    marginLeft: "10%"
                  }}
                >
                  {connection.social}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default Connections;
