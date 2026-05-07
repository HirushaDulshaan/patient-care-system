import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";

// --- GraphQL Queries & Mutations ---
const GET_ALL_STAFF = gql`
  query GetAllStaff {
    getAllStaff {
      id
      firstName
      lastName
      designation
      city
      phone
      address1
      address2
      user {
        email
      }
    }
  }
`;

const GET_ROLES = gql`
  query GetRoles {
    __type(name: "Role") {
      enumValues {
        name
      }
    }
  }
`;

const REGISTER_STAFF = gql`
  mutation RegisterStaff(
    $email: String!
    $role: Role!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $designation: String!
    $city: String!
    $address1: String
    $address2: String
  ) {
    registerStaff(
      email: $email
      role: $role
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      designation: $designation
      city: $city
      address1: $address1
      address2: $address2
    )
  }
`;

const UPDATE_STAFF = gql`
  mutation UpdateStaff(
    $id: String!
    $firstName: String!
    $lastName: String!
    $phone: String!
    $designation: String!
    $city: String!
    $address1: String
    $address2: String
  ) {
    updateStaff(
      id: $id
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      designation: $designation
      city: $city
      address1: $address1
      address2: $address2
    )
  }
`;

const StaffManagement = () => {
  // Form States
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [designation, setDesignation] = useState("Nurse");

  // Logic States
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewingStaff, setViewingStaff] = useState<any | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  // Apollo Hooks
  const { data, loading: queryLoading } = useQuery(GET_ALL_STAFF);
  const { data: roleData } = useQuery(GET_ROLES);

  const [registerStaff, { loading: regLoading }] = useMutation(REGISTER_STAFF, {
    refetchQueries: [{ query: GET_ALL_STAFF }],
  });

  const [updateStaff, { loading: updateLoading }] = useMutation(UPDATE_STAFF, {
    refetchQueries: [{ query: GET_ALL_STAFF }],
  });

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentStaff =
    data?.getAllStaff.slice(indexOfFirstRecord, indexOfLastRecord) || [];
  const totalPages = Math.ceil(
    (data?.getAllStaff.length || 0) / recordsPerPage,
  );

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress1("");
    setAddress2("");
    setCity("");
    setSelectedId(null);
    setIsEditing(false);
  };

  const handleEditInitiate = (staff: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedId(staff.id);
    setFirstName(staff.firstName);
    setLastName(staff.lastName);
    setEmail(staff.user.email);
    setPhone(staff.phone || "");
    setCity(staff.city || "");
    setAddress1(staff.address1 || "");
    setAddress2(staff.address2 || "");
    setDesignation(staff.designation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const role = designation === "Receptionist" ? "RECEPTIONIST" : "STAFF";
      const variables = {
        firstName,
        lastName,
        phone,
        designation,
        city,
        address1,
        address2,
      };

      if (isEditing && selectedId) {
        await updateStaff({ variables: { id: selectedId, ...variables } });
        toast.success("Staff details have been updated successfully.");
      } else {
        await registerStaff({ variables: { email, role, ...variables } });
        toast.success("New staff member has been added to the registry.");
      }
      resetForm();
    } catch (err: any) {
      toast.error("An error occurred while saving the staff details.");
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex flex-col">
      {/* --- Info Modal (Popup) --- */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl relative">
            <button
              onClick={() => setViewingStaff(null)}
              className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 font-black text-xs transition-colors"
            >
              CLOSE
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto flex items-center justify-center text-2xl font-black text-blue-600 mb-4 shadow-inner">
                {viewingStaff.firstName[0]}
              </div>
              <h4 className="text-2xl font-black text-slate-900 leading-tight">
                {viewingStaff.firstName} {viewingStaff.lastName}
              </h4>
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1">
                {viewingStaff.designation}
              </p>
            </div>
            <div className="mt-8 space-y-4 border-t border-slate-50 pt-8">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Email
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {viewingStaff.user.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Contact
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {viewingStaff.phone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Address 1
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {viewingStaff.address1 || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Address 2
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {viewingStaff.address2 || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  City
                </span>
                <span className="text-sm font-bold text-slate-700">
                  {viewingStaff.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 pt-0.5 pb-1 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Staff Management
            </h2>
            <p className="text-slate-500 font-medium mt-0.5">
              Manage hospital support staff including Nurses and Receptionists.
            </p>
          </div>
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-xs uppercase tracking-widest">
            Administrator Mode
          </div>
        </div>
      </div>

      {/* Main content area — fills remaining height, no overflow on this level */}
      <div className="flex-1 overflow-hidden max-w-7xl w-full mx-auto px-4 md:px-6 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* --- Left Form --- */}
          <div className="lg:col-span-4 h-full overflow-hidden">
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-8 pb-4 flex-shrink-0">
                <h3 className="text-xl font-black text-slate-800">
                  {isEditing ? "Update Details" : "Register New Staff"}
                </h3>
              </div>

              {/* Scrollable fields area */}
              <div className="flex-1 overflow-y-auto px-8 space-y-4 pb-2">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="text"
                  placeholder="Contact Number"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  disabled={isEditing}
                  className={`w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm ${isEditing && "opacity-50"}`}
                  required
                />

                <div className="pt-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Location Info
                  </label>
                  <input
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    type="text"
                    placeholder="Address Line 1"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm mb-3"
                  />
                  <input
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    type="text"
                    placeholder="Address Line 2"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm mb-3"
                  />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    type="text"
                    placeholder="City"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                    required
                  />
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Assign Role
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none font-black text-blue-600 text-sm appearance-none"
                  >
                    {roleData?.__type.enumValues
                      .filter(
                        (r: any) =>
                          r.name === "STAFF" || r.name === "RECEPTIONIST",
                      )
                      .map((r: any) => (
                        <option key={r.name} value={r.name}>
                          {r.name === "STAFF" ? "Nurse / Staff" : r.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="p-8 pt-4 flex-shrink-0 border-t border-slate-100">
                <button
                  disabled={regLoading || updateLoading}
                  onClick={handleSubmit}
                  type="button"
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  {isEditing
                    ? updateLoading
                      ? "Updating..."
                      : "Save Changes"
                    : regLoading
                      ? "Processing..."
                      : "Complete Registration"}
                </button>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    type="button"
                    className="w-full mt-2 text-slate-400 font-black text-[10px] uppercase tracking-widest"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* --- Right: Staff Directory --- */}
          <div className="lg:col-span-8 h-full overflow-hidden">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                  Active Support Staff
                </h3>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                  Verified Staff
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4">Staff Member</th>
                      <th className="pb-4">Designation</th>
                      <th className="pb-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {queryLoading ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="text-center py-10 text-slate-400 font-bold text-xs"
                        >
                          LOADING...
                        </td>
                      </tr>
                    ) : (
                      currentStaff.map((staff: any) => (
                        <tr
                          key={staff.id}
                          onClick={() => setViewingStaff(staff)}
                          className="hover:bg-blue-50/30 transition cursor-pointer group"
                        >
                          <td className="py-5">
                            <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                              {staff.firstName} {staff.lastName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {staff.user?.email}
                            </p>
                          </td>
                          <td className="py-5">
                            <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">
                              {staff.designation}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <button
                              onClick={(e) => handleEditInitiate(staff, e)}
                              className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 transition-all shadow-md"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination — pinned at bottom */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100 flex-shrink-0 mt-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Page {currentPage} of {totalPages || 1}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-[10px] uppercase disabled:opacity-30 transition-all hover:bg-slate-50"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase disabled:opacity-30 transition-all hover:bg-blue-600 shadow-md"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
