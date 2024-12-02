import { notification, Popover, Spin } from "antd";
import { useState } from "react";
import { getTodoTipById } from "../../../../api/ai";
import { CloseOutlined } from "@ant-design/icons";

type Props = {
  id: number;
};

export const AiTip: React.FC<Props> = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [tip, setTip] = useState("");

  const handleTipRequest = async () => {
    setLoading(true);
    try {
      const response = await getTodoTipById(id);

      if (typeof response !== "string") {
        throw new Error("Invalid response");
      }

      setTip(response);
    } catch (e) {
      console.error(e);
      notification.error({
        message: "Failed to get AI tip",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover
      overlayStyle={{ maxWidth: 300 }}
      content={
        loading ? (
          <Spin />
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CloseOutlined onClick={() => setTip("")} />
            </div>
            <span>{tip}</span>
          </div>
        )
      }
      open={!!tip.length || loading}
    >
      <button type="button" className="black-button" onClick={handleTipRequest}>
        AI TIP
      </button>
    </Popover>
  );
};
