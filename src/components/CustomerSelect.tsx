import { useState, useEffect } from "react";
import Select from "react-select";
import type { User } from "../types";

type CustomerSelectProps = {
  value?: number;
  onChange: (customerId: number) => void;
  isStaff: boolean;
  currentUserId: number;
};

type CustomerOption = {
  value: number;
  label: string;
  data: User;
};

export default function CustomerSelect({
  value,
  onChange,
  isStaff,
  currentUserId,
}: CustomerSelectProps) {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log("Fetching customers with token:", token); // Debug log

        const response = await fetch(
          "http://localhost:5000/api/auth/customers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const users: User[] = await response.json();
        console.log("Received customers:", users); 

        if (!Array.isArray(users)) {
          throw new Error("Invalid response format");
        }

        const options = users.map((user) => ({
          value: user.id,
          label: user.name ? `${user.name} (${user.email})` : user.email,
          data: user,
        }));

        setCustomers(options);
        setError("");
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load customers"
        );
        setCustomers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isStaff) {
      fetchCustomers();
    } else {
      // If not staff,set current user as the only option
      setCustomers([
        {
          value: currentUserId,
          label: "Self",
          data: { id: currentUserId } as User,
        },
      ]);
      setIsLoading(false);
    }
  }, [isStaff, currentUserId]);

  const selectedOption = customers.find((c) => c.value === value);

  return (
    <div className="form-group">
      <label htmlFor="customer-select">Customer</label>
      <Select
        id="customer-select"
        classNamePrefix="select"
        value={selectedOption}
        onChange={(option) => onChange(option?.value || currentUserId)}
        options={customers}
        isDisabled={!isStaff || isLoading}
        isLoading={isLoading}
        placeholder={isLoading ? "Loading customers..." : "Select a customer"}
        noOptionsMessage={() =>
          error ? `Error: ${error}` : "No customers found"
        }
      />
      {error && (
        <div
          className="error-text"
          style={{
            marginTop: "0.5rem",
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
