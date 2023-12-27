import { Button } from "@payconstruct/design-system";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <section
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Result
        status={"404"}
        title={"Not Found"}
        subTitle={"Sorry, the page you visited does not exist."}
        extra={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Button
              type="secondary"
              onClick={() => navigate("/")}
              label={"Go back to the home page"}
              style={{ marginRight: "30px" }}
            />

            <Button
              type="primary"
              onClick={() => {
                navigate(0);
              }}
              label={"Try again"}
            />
          </div>
        }
      />
    </section>
  );
};

export { PageNotFound as default };
