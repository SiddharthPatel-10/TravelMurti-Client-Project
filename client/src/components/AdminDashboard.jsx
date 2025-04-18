import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SubPackageManager from "./SubPackageManager";
import AdminUsersTable from "./AdminUsersTable";
import UpdateSubPackageForm from "./UpdateSubPackageForm";
import EnquiryTable from "./EnquiryTable";
import DOMPurify from "dompurify";
import { useDispatch } from "react-redux"; // Import useDispatch
import { logoutUser } from "../redux/userSlice"; // Import logoutUser action
import { FiLogOut } from "react-icons/fi"; // Import FiLogOut icon
import { FiSearch } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";

import {
  FiPackage,
  FiUsers,
  FiInbox,
  FiUserPlus,
  FiMenu,
  FiMessageSquare,
} from "react-icons/fi";
import { FaSearch } from "react-icons/fa";

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [formData, setFormData] = useState({ category: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subPackages, setSubPackages] = useState([]);
  const [loadingSubPackages, setLoadingSubPackages] = useState(true);
  const [showSubPackages, setShowSubPackages] = useState(false);
  const [showUsersTable, setShowUsersTable] = useState(false);
  const [selectedSubPackage, setSelectedSubPackage] = useState(null);
  const [showEnquiryTable, setShowEnquiryTable] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(true); // State to manage search bar visibility
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Step 1: Search state
  const filteredSubPackages = subPackages.filter((subPkg) =>
    subPkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 480);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch packages on mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get("/packages");
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    // Function to handle click outside
    const handleClickOutside = (event) => {
      // Close input if clicked outside of the input and icon
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    // Add event listeners for resize and click outside
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeletePackage = async (id) => {
    try {
      await axiosInstance.delete(`/packages/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
      toast.success("Package deleted Successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Error deleting package. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleEditPackage = (pkg) => {
    setFormData({ category: pkg.category, description: pkg.description });
    setIsEditing(true);
    setSelectedPackage(pkg._id);
  };

  const handleCreateOrUpdatePackage = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update package
      try {
        await axiosInstance.put(`/packages/${selectedPackage}`, formData);
        setPackages(
          packages.map((pkg) =>
            pkg._id === selectedPackage ? { ...pkg, ...formData } : pkg
          )
        );
        toast.success("Package updated Successfully!", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error updating package:", error);
        toast.error("You are not Authorized!!", {
          position: "top-right",
        });
      }
    } else {
      // Create package
      try {
        const response = await axiosInstance.post("/packages", formData);
        setPackages([...packages, response.data]);
        toast.success("Package created Successfully!", {
          position: "top-right",
        });
      } catch (error) {
        console.error("Error creating package:", error);
        toast.error("Error creating package. Please try again.", {
          position: "top-right",
        });
      }
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ category: "", description: "" });
    setIsEditing(false);
    setSelectedPackage(null);
  };

  // Fetch sub-packages when admin selects to view them
  const fetchSubPackages = async () => {
    try {
      const response = await axiosInstance.get("/subPackages");
      setSubPackages(response.data);
    } catch (error) {
      console.error("Error fetching sub-packages:", error);
      toast.error("Failed to load sub-packages.");
    } finally {
      setLoadingSubPackages(false);
    }
  };

  const handleSubpackagesClick = () => {
    setShowSubPackages(true);
    fetchSubPackages();
  };

  const handleUpdateClick = (subPkg) => {
    setSelectedSubPackage(subPkg);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleUpdateSubPackage = async (id, updatedData) => {
    try {
      // Use axios to send the PUT request
      const response = await axiosInstance.put(
        `/subpackages/${id}`,
        updatedData
      );

      // Axios response is directly usable; no need for response.json()
      const data = response.data;

      // Assuming you have a state that holds your subpackages
      setSubPackages((prev) =>
        prev.map((pkg) => (pkg._id === id ? data : pkg))
      );

      // Optionally reset the selected subpackage
      setSelectedSubPackage(null);
      toast.success("SubPackage Updated Successfully!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Network error:", error);
      toast.success("SubPackage Updated Successfully!", {
        position: "top-right",
      });
    }
  };

  const handleCancelUpdate = () => {
    setSelectedSubPackage(null); // Clear the selected subpackage
  };

  // Handle delete subpackage
  const handleDeleteSubPackage = async (id) => {
    try {
      await axiosInstance.delete(`/subPackages/${id}`);
      setSubPackages(subPackages.filter((pkg) => pkg._id !== id));
      toast.success("SubPackage deleted Successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Error deleting SubPackage. Please try again.", {
        position: "top-right",
      });
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  const handleSearchIconClick = () => {
    setShowInput(true); // Show input field when the icon is clicked
  };

  return (
    <div className="flex min-h-screen bg-gray-100 pt-0">
      {/* Sidebar Toggle Button for Mobile */}
      <div className="absolute top-4 left-4">
        <button
          onClick={handleSidebarToggle}
          className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-md"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Background Overlay (visible only when sidebar is open) */}
      {isSidebarOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 bg-white w-64 sm:w-48 p-5 shadow-md md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <h2 className="text-xl font-bold mb-5 pl-4">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <button
              onClick={() => {
                setShowUsersTable(false);
                setShowSubPackages(false);
                setSelectedPackage(null);
                setShowEnquiryTable(false);
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiPackage className="mr-2" /> Packages
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                setShowUsersTable(false);
                setShowSubPackages(true);
                fetchSubPackages(); // Fetch SubPackages
                setShowEnquiryTable(false);
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiInbox className="mr-2" /> SubPackages
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                setShowUsersTable(false);
                setShowSubPackages(false);
                setShowEnquiryTable(true); // Show Enquiry Table
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiMessageSquare className="mr-2" /> Enquiries
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                setShowUsersTable(true);
                setShowSubPackages(false);
                setSelectedPackage(null);
                setShowEnquiryTable(false);
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiUsers className="mr-2" /> Users
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                navigate("/create-employee");
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiUserPlus className="mr-2" /> Create Employee
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                navigate("/update-we-are-hiring");
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200"
            >
              <FiEdit className="mr-2" /> Update We Are Hiring
            </button>
          </li>
          <li className="mb-4">
            <button
              onClick={() => {
                // Dispatch logout action to reset Redux state
                dispatch(logoutUser());

                // Clear token from local storage
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");

                // Redirect user to login page
                navigate("/admin/login");
                toast.success("You have Successfully logged out!", {
                  position: "top-right",
                });
              }}
              className="flex items-center w-full text-left py-2 px-4 hover:bg-gray-200 text-red-600"
            >
              <FiLogOut className="mr-2" /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 w-full">
        {/* toggle bugg: */}
        {/* <h1 className="text-2xl text-gray-800 ml- text-center font-bold mb-5 mx-auto block sm:hidden">
          Welcome to the Admin Dashboard!
        </h1> */}

        {loading && <p>Loading...</p>}
        <>
          {showEnquiryTable ? (
            <EnquiryTable />
          ) : showUsersTable ? (
            <AdminUsersTable />
          ) : !showSubPackages ? (
            <div>
              <h2 className="text-2xl font-bold mb-5 ml-12 md:ml-0">
                Packages
              </h2>
              {/* Adjust grid for mobile to larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-white p-5 rounded-lg shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold">{pkg.category}</h3>
                      <p className="text-gray-600">{pkg.description}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPackage(pkg)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedPackage(pkg._id)} // Pass the current package's id
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Manage SubPackages
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleCreateOrUpdatePackage}
                className="bg-white p-5 rounded-lg shadow-md mt-5"
              >
                <h3 className="text-lg font-bold mb-4">
                  {isEditing ? "Edit Package" : "Create Package"}
                </h3>
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full mb-4 border border-gray-300 rounded px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update Package" : "Create Package"}
                </button>
              </form>
              {selectedPackage && (
                <SubPackageManager packageId={selectedPackage} />
              )}
            </div>
          ) : (
            // Render SubPackages here
            <div className="p-5 bg-gray-50 min-h-screen">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-center text-gray-800">
                All SubPackages
              </h2>

              <div className="relative mb-1" ref={inputRef}>
                {" "}
                {/* Set ref on the parent div */}
                <div className="absolute -top-12 right-[2px] md:right-5 z-10 w-1/4">
                  {isMobile ? (
                    <>
                      {showInput ? (
                        <input
                          type="text"
                          placeholder="Search SubPackage by Name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border border-gray-300 p-2 rounded-2xl w-full"
                        />
                      ) : (
                        <div className="flex justify-end">
                          {" "}
                          {/* Aligns the icon to the right */}
                          <FaSearch
                            className="text-gray-500 cursor-pointer"
                            size={24}
                            onClick={handleSearchIconClick} // Show input on icon click
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      type="text"
                      placeholder="Search SubPackage by Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 p-2 rounded-2xl w-full"
                    />
                  )}
                </div>
              </div>

              {loadingSubPackages ? (
                <p className="text-center text-gray-600">Loading...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubPackages.length > 0 ? (
                    filteredSubPackages.map((subPkg) => (
                      <div
                        key={subPkg._id}
                        className="bg-white p-6 rounded-lg shadow-lg transition-colors duration-200 hover:bg-gray-100 hover:shadow-md"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {subPkg.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {subPkg.description}
                        </p>
                        <p className="font-medium text-gray-700">
                          Price:{" "}
                          <span className="text-green-500">
                            ₹{subPkg.price}
                          </span>
                        </p>
                        <p className="font-medium text-gray-700">
                          Duration: {subPkg.duration}
                        </p>

                        <p
                          className={`font-medium text-gray-700 ${
                            subPkg.isDealOfTheDay
                              ? "bg-yellow-100 text-yellow-800  py-1 rounded-md"
                              : ""
                          }`}
                        >
                          Trending Tour Package:{" "}
                          {subPkg.isDealOfTheDay ? "Yes" : "No"}
                        </p>

                        <div className="font-medium text-gray-700">
                          Introduction:
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(subPkg.introduction),
                            }}
                          />
                        </div>
                        <div className="font-medium text-gray-700">
                          Tour Plan:
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(subPkg.tourPlan),
                            }}
                          />
                        </div>
                        <div className="font-medium text-gray-700">
                          Includes/Excludes:
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(subPkg.includeExclude),
                            }}
                          />
                        </div>
                        {/* <div className="font-medium text-gray-700">
                          Hotel Info:
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(subPkg.hotelInfo),
                            }}
                          />
                        </div> */}

                        {subPkg.galleryImages.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-bold text-gray-800 mb-2">
                              Gallery:
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {subPkg.galleryImages.map((image) => (
                                <img
                                  key={image._id}
                                  src={image.url}
                                  alt={subPkg.name}
                                  className="w-full h-32 object-cover rounded-md shadow-sm"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {subPkg.pricingDetails.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-bold text-gray-800 mb-2">
                              Pricing Details:
                            </h4>
                            {subPkg.pricingDetails.map((pricing) => (
                              <p key={pricing._id} className="text-gray-700">
                                {pricing.noOfPax} Pax - {pricing.cab}:{" "}
                                <span className="font-semibold">
                                  ₹{pricing.costPerPax}
                                </span>
                              </p>
                            ))}
                          </div>
                        )}
                        <div className="mt-4 flex space-x-3">
                          <button
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                            onClick={() => handleUpdateClick(subPkg)}
                          >
                            Update
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => handleDeleteSubPackage(subPkg._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600">
                      No SubPackages found.
                    </p>
                  )}
                </div>
              )}
              {selectedSubPackage && (
                <UpdateSubPackageForm
                  subPackage={selectedSubPackage}
                  onUpdate={handleUpdateSubPackage}
                  onCancel={handleCancelUpdate}
                />
              )}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default AdminDashboard;
// Perfectly working
