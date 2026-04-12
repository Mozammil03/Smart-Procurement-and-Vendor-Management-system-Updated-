import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Approval() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const r = await api.get("/requisitions");
    setList(r.data);
  };

  const approve = async (id) => {
    await api.post(`/approvals/${id}`, {
      requisitionId: id,
      managerId: 4,
      status: "APPROVED",
      remarks: "Approved"
    });
    load();
  };

  return (
    <div>
      <h2>Approvals</h2>
      {list.map(r => (
        <div key={r.id}>
          {r.item?.itemName} - {r.status}
          <button onClick={() => approve(r.id)}>Approve</button>
        </div>
      ))}
    </div>
  );
}