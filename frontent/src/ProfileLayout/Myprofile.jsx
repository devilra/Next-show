import { useState } from "react";
import { useSelector } from "react-redux";
import { USER } from "./ProfileComponents/Sidebar";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../../context/SnackbarContext";
import api from "../api";
import CustomDatePicker from "./ProfileComponents/CustomDatePicker";

const MyProfilePage = () => {
  const { currentUser } = useSelector((state) => state.userAuth);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  // ======================================================
  // ✅ PROFILE IMAGE PREVIEW
  // ======================================================

  const [previewImage, setPreviewImage] = useState(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    // ======================================================
    // ✅ GOOGLE / CLOUD / FULL URL
    // ======================================================

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // ======================================================
    // ✅ LOCAL UPLOAD IMAGE
    // ======================================================

    return `${IMAGE_BASE_URL}${imagePath}`;
  };

  // ======================================================
  // ✅ ACCOUNT EDIT STATE
  // ======================================================

  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    username: currentUser?.username || "",
    gender: currentUser?.gender || "",
    dateOfBirth: currentUser?.dateOfBirth || "",
  });

  console.log(editValues);

  // ── Original values (to detect change) ─────────────────
  const originalValues = {
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    username: currentUser?.username || "",
    gender: currentUser?.gender || "",
    dateOfBirth: currentUser?.dateOfBirth || "",
  };

  // ======================================================
  // ✅ PROFILE USER DATA
  // ======================================================

  const profileUser = {
    id: currentUser?.id,
    name: currentUser?.fullName || "Unknown User",
    username: currentUser?.username || "",
    avatar: currentUser?.profileImage || null,
    initials:
      currentUser?.fullName
        ?.split(" ")
        ?.map((word) => word[0])
        ?.join("")
        ?.slice(0, 2)
        ?.toUpperCase() || "U",
    email: currentUser?.email,
    gender: currentUser?.gender || "Not Specified",
    role: currentUser?.role || "USER",
    isEmailVerified: currentUser?.isEmailVerified || false,
    joined: "Member since 2025",
    plan: "Premium",
    stats: [
      { label: "Watched", value: "0" },
      { label: "Reviews", value: "0" },
      { label: "Watchlist", value: "0" },
      { label: "Following", value: "0" },
    ],
    recentActivity: [],
    favoriteGenres: [],
  };

  // ======================================================
  // ✅ HANDLERS
  // ======================================================

  const handleEdit = (field) => {
    setEditingField((prev) => (prev === field ? null : field));
  };

  const handleCancel = (field) => {
    setEditValues((p) => ({ ...p, [field]: originalValues[field] }));
    setEditingField(null);
  };

  // const handleSave = (field) => {
  //   // 🔴 TODO: dispatch update mutation here with editValues[field]
  //   console.log("Saving field:", field, "→", editValues[field]);
  //   setEditingField(null);
  // };

  // ── Helpers ─────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getFieldError = (field) => {
    const currentVal = editValues[field];
    const originalVal = originalValues[field];
    const hasChanged = currentVal !== originalVal;

    if (field === "email" && hasChanged && !emailRegex.test(currentVal)) {
      if (!currentVal.trim()) return "Email cannot be empty.";
      if (!currentVal.includes("@")) return 'Email must include "@".';
      if (!currentVal.includes(".")) return "Email must include a domain.";
      return "Please enter a valid email address.";
    }

    return null; // no error
  };

  const isSaveEnabled = (field) => {
    const currentVal = editValues[field];
    const originalVal = originalValues[field];
    const hasChanged = currentVal !== originalVal;

    if (!hasChanged) return false;
    if (field === "email") return emailRegex.test(currentVal);
    return true;
  };

  // ======================================================
  // ✅ HANDLE PROFILE IMAGE CHANGE
  // ======================================================
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // ============================================
    // ✅ LOCAL PREVIEW
    // ============================================
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    // ============================================
    // ✅ UPLOAD IMAGE
    // ============================================

    uploadProfileImageMutation.mutate(file);
  };

  // ======================================================
  // ✅ UPDATE ACCOUNT DETAILS MUTATION
  // ======================================================
  const updateAccountDetailsMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      // ============================================
      // ✅ BACKEND BODY
      // ============================================
      const body = {
        [field]: value,
      };
      const response = await api.put("/auth/user/update-account-details", body);
      return response.data;
    },
    // ======================================================
    // ✅ SUCCESS
    // ======================================================
    onSuccess: async (data, variables) => {
      // ============================================
      // ✅ SNACKBAR
      // ============================================
      showSnackbar(data?.message || "Account details updated", "success");
      // // ============================================
      // // ✅ REFRESH CURRENT USER
      // // ============================================
      // await queryClient.invalidateQueries({
      //   queryKey: ["current-user"],
      // });

      // ============================================
      // ✅ UPDATE CURRENT USER CACHE
      // ============================================

      queryClient.setQueryData(["current-user"], (oldData) => {
        // ========================================
        // ✅ SAFETY CHECK
        // ========================================
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          user: {
            ...oldData.user,
            [variables.field]: variables.value,
          },
        };
      });

      // ============================================
      // ✅ CLOSE EDIT MODE
      // ============================================
      setEditingField(null);
    },
    // ======================================================
    // ✅ ERROR
    // ======================================================
    onError: (error) => {
      showSnackbar(
        error?.response?.data?.message || "Failed to update account details",
        "error",
      );
    },
  });

  // ======================================================
  // ✅ HANDLE SAVE
  // ======================================================
  const handleSave = (field) => {
    // ============================================
    // ✅ CURRENT VALUE
    // ============================================
    const value = editValues[field];
    // ============================================
    // ✅ EMPTY CHECK
    // ============================================

    if (value === undefined || value === null || value === "") {
      showSnackbar("Field cannot be empty", "error");

      return;
    }

    // ============================================
    // ✅ API CALL
    // ============================================

    updateAccountDetailsMutation.mutate({
      field,
      value,
    });
  };

  // ======================================================
  // ✅ SUB-COMPONENTS
  // ======================================================

  const StatCard = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center py-4 px-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-orange-900/60 transition-all duration-300 group">
      <span className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors duration-300">
        {value}
      </span>
      <span className="text-xs text-zinc-500 mt-1 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );

  const uploadProfileImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("profileImage", file);
      const response = await api.put(
        "/auth/user/update-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    // ======================================================
    // ✅ SUCCESS
    // ======================================================
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      // ============================================
      // ✅ REFRESH CURRENT USER
      // ============================================
      queryClient.invalidateQueries({
        queryKey: ["current-user"],
      });
      // ============================================
      // ✅ REMOVE LOCAL PREVIEW
      // ============================================
      setPreviewImage(null);
    },
    // ======================================================
    // ✅ ERROR
    // ======================================================
    onError: (error) => {
      console.log(error);
      showSnackbar(
        error?.response?.data?.message || "Failed to upload profile image",
        "error",
      );
      setPreviewImage(null);
    },
  });

  const SectionHeader = ({ title, count }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-5 w-1 rounded-full bg-orange-500" />
      <h2 className="text-sm font-semibold text-zinc-200 tracking-widest uppercase">
        {title}
      </h2>
      {count !== undefined && (
        <span className="ml-auto text-xs text-zinc-600 font-mono">{count}</span>
      )}
    </div>
  );

  // ── Editable account row ────────────────────────────────
  const AccountRow = ({
    field,
    label,
    value,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChange,
    inputType = "text",
    placeholder = "",
    selectOptions = [],
  }) => {
    const saveEnabled = isSaveEnabled(field);
    const fieldError = getFieldError(field);

    return (
      <div className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap">
        <span className="text-xs text-[14px] text-zinc-500 tracking-wide min-w-[110px]">
          {label}
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {!isEditing ? (
            <>
              {/* ── Current value ── */}
              <span
                className={`text-xs md:text-[13px] tracking-wider font-medium ${
                  value ? "text-zinc-300" : "text-zinc-600 italic"
                }`}
              >
                {value || "Not set"}
              </span>

              {/* ── Edit pencil button ── */}
              <button
                onClick={onEdit}
                className="w-[26px] h-[26px] flex items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all duration-200 hover:scale-105 cursor-pointer"
                title={`Edit ${label}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              {/* ── Inline input ── */}
              {inputType === "select" ? (
                <select
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="bg-zinc-950 border border-orange-500/40 focus:border-orange-500 rounded-lg text-white text-xs px-3 py-1.5 outline-none w-40 transition-all duration-200 shadow-[0_0_0_2px_rgba(249,115,22,0.08)]"
                  autoFocus
                >
                  <option value="">Select</option>
                  {selectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={inputType}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className={`bg-zinc-950 border rounded-lg text-white  text-xs md:text-[12px] px-3 py-1.5 outline-none w-40 transition-all duration-200
                    ${
                      fieldError
                        ? "border-red-500/60 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.08)]"
                        : "border-orange-500/40 focus:border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.08)]"
                    }
                  `}
                  style={inputType === "date" ? { colorScheme: "dark" } : {}}
                  autoFocus
                />
              )}

              {/* ══ Warning icon (shows only when there's a field error) ══ */}
              {fieldError && (
                <div className="relative group/tooltip">
                  {/* ── Warning icon ── */}
                  <div className="w-[26px] h-[26px] flex items-center justify-center rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 cursor-default flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>

                  {/* ── Tooltip ── */}
                  <div
                    className="
                      absolute z-50
                      bottom-full right-0
                      mb-2
                      px-3 py-2
                      rounded-lg
                      bg-zinc-900
                      border border-red-500/30
                      shadow-[0_4px_24px_rgba(0,0,0,0.5)]
                      text-red-400
                      text-[11px]
                      font-medium
                      whitespace-nowrap
                      pointer-events-none
                      opacity-0
                      group-hover/tooltip:opacity-100
                      transition-opacity duration-200
                    "
                  >
                    {/* ── Arrow ── */}
                    <div
                      className="
                        absolute -bottom-[5px] right-[7px]
                        w-[9px] h-[9px]
                        rotate-45
                        bg-zinc-900
                        border-r border-b border-red-500/30
                      "
                    />
                    {fieldError}
                  </div>
                </div>
              )}

              {/* ── Save button ── */}

              <button
                onClick={() => handleSave(field)}
                disabled={
                  !saveEnabled || updateAccountDetailsMutation.isPending
                }
                className={`
    flex items-center gap-1.5

    text-[10px]
    font-bold
    tracking-wide

    px-3 py-1.5

    rounded-lg

    text-white
    border-none

    transition-all duration-200

    whitespace-nowrap

    min-w-[74px]
    justify-center

    ${
      saveEnabled
        ? `
          bg-gradient-to-r
          from-orange-500
          to-red-600

          cursor-pointer

          hover:opacity-90
          hover:scale-[1.03]

          active:scale-95

          shadow-[0_0_14px_rgba(249,115,22,0.3)]
        `
        : `
          bg-zinc-700
          cursor-not-allowed
          opacity-40
        `
    }
  `}
              >
                {/* ============================================ */}
                {/* ✅ LOADING */}
                {/* ============================================ */}

                {updateAccountDetailsMutation.isPending ? (
                  <div
                    className="
        w-[10px]
        h-[10px]

        rounded-full

        border-[1.8px]
        border-white/20
        border-t-white
        border-r-white

        animate-spin

        shadow-[0_0_8px_rgba(255,255,255,0.2)]

        shrink-0
      "
                    style={{
                      animation:
                        "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
                    }}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    className="shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}

                {/* ============================================ */}
                {/* ✅ TEXT */}
                {/* ============================================ */}

                <span>Save</span>
              </button>

              {/* ── Cancel button ── */}
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200 transition-all duration-200 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ── Read-only account row ───────────────────────────────
  const ReadOnlyRow = ({ label, value, isBadge = false }) => (
    <div className="flex items-center justify-between px-4 py-3 gap-3">
      <span className="text-xs text-zinc-500 tracking-wide min-w-[110px]">
        {label}
      </span>
      <div className="flex items-center gap-2 ml-auto">
        {isBadge ? (
          <span className="text-xs md:text-[12px] font-bold tracking-widest px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {value}
          </span>
        ) : (
          <span className="text-xs md:text-[12px] text-zinc-300 font-medium">
            {value}
          </span>
        )}
      </div>
    </div>
  );

  // ======================================================
  // ✅ RENDER
  // ======================================================

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden">
          <div
            className="h-36 w-full"
            style={{
              background:
                "linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #0f0f0f 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-end p-6 gap-5">
            {/* <div className="relative w-[120px] h-[110px]">
        

              <div
                className="
                  w-full h-full
                  rounded-[22px]
                  overflow-hidden
                  border-[2px]
                  border-orange-500/30
                  shadow-[0_0_30px_rgba(249,115,22,0.18)]
                  bg-gradient-to-br
                  from-orange-500
                  via-red-600
                  to-red-700
                  flex items-center justify-center
                  relative
                "
              >
                {uploadProfileImageMutation.isPending ? (
                  // ====================================================
                  // ✅ LOADING SPINNER
                  // ====================================================

                  <div
                    className="
      absolute inset-0
      flex items-center justify-center
      bg-black/50
      backdrop-blur-[2px]
      z-20
    "
                  >
                    <div
                      className="
        w-10 h-10
        rounded-full
        border-[2px]
        border-white/10
        border-t-red-500
        border-r-red-400
        animate-spin
        motion-safe:animate-[spin_0.7s_linear_infinite]
        shadow-[0_0_12px_rgba(239,68,68,0.45)]
      "
                      style={{
                        animation:
                          "spin 0.7s linear infinite, jelly 1.2s ease-in-out infinite",
                      }}
                    />
                  </div>
                ) : previewImage || profileUser?.avatar ? (
                  <img
                    src={previewImage || getImageUrl(profileUser?.avatar)}
                    alt={profileUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="
                  text-white
                  text-3xl
                  font-black
                  tracking-wide
                  uppercase
                           "
                  >
                    {profileUser?.initials}
                  </span>
                )}
              </div>

            

              <div
                className="
                  absolute
                  bottom-0
                  right-0
                  w-5 h-5
                  rounded-full
                  bg-emerald-400
                  border-[3px]
                  border-[#0c0c0d]
                  shadow-[0_0_12px_rgba(16,185,129,0.6)]
                "
              />

             

              <input
                type="file"
                id="profile-avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />

           

              <label
                htmlFor="profile-avatar-upload"
                className="
                  absolute
                  -bottom-1
                  -right-1
                  w-8 h-8
                  rounded-full
                  bg-gradient-to-br
                  from-orange-500
                  to-red-600
                  border-[3px]
                  border-[#0c0c0d]
                  flex items-center justify-center
                  cursor-pointer
                  transition-all duration-300
                  hover:scale-110
                  hover:rotate-90
                  active:scale-95
                  shadow-[0_0_18px_rgba(249,115,22,0.45)]
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="w-4 h-4"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </label>
            </div> */}

            <div className="pb-2">
              {/* NAME */}
              <h2 className="text-3xl text-white tracking-tight leading-none">
                {profileUser?.name}
              </h2>

              {/* USERNAME */}
              <p className="mt-1 text-zinc-400 text-sm md:text-base font-medium">
                {profileUser?.username || profileUser?.email}
              </p>
            </div>

            {/* Role badge */}
            <div className="ml-auto pb-2">
              <span
                className={`
                  text-[10px]
                  md:text-[13px]
                  lg:text-[15px]
                  px-4 py-1.5
                  rounded-full
                  border
                  font-bold
                  
                  uppercase
                  shadow-[0_0_20px_rgba(249,115,22,0.12)]
                  ${
                    currentUser?.role === "ADMIN"
                      ? "bg-red-900/40 text-red-300 border-red-500/20"
                      : "bg-orange-900/40 text-orange-500 border-orange-500/20"
                  }
                `}
              >
                {currentUser?.role || "USER"}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {/* <div className="grid grid-cols-4 gap-3">
          {USER.stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div> */}

        {/* Favorite Genres */}
        {/* <div>
          <SectionHeader title="Favorite Genres" />
          <div className="flex flex-wrap gap-2">
            {USER.favoriteGenres.map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-orange-800/60 hover:text-orange-400 transition-all duration-200 cursor-default"
              >
                {g}
              </span>
            ))}
          </div>
        </div> */}

        {/* Recent Activity */}
        {/* <div>
          <SectionHeader
            title="Recent Activity"
            count={USER.recentActivity.length}
          />
          ...
        </div> */}

        {/* ====================================================== */}
        {/* ✅ ACCOUNT INFO                                         */}
        {/* ====================================================== */}

        <div>
          <SectionHeader title="Account" />
          <div className="rounded-xl bg-zinc-900/50 border border-zinc-800 divide-y divide-zinc-800/60">
            {/* ── EDITABLE: Full Name ── */}
            <AccountRow
              field="fullName"
              label="Full Name"
              value={editValues.fullName}
              isEditing={editingField === "fullName"}
              onEdit={() => handleEdit("fullName")}
              onSave={() => handleSave("fullName")}
              onCancel={() => handleCancel("fullName")}
              onChange={(val) =>
                setEditValues((p) => ({ ...p, fullName: val }))
              }
              inputType="text"
              placeholder="Enter full name"
            />

            {/* ── EDITABLE: Email ── */}
            <AccountRow
              field="email"
              label="Email"
              value={editValues.email}
              isEditing={editingField === "email"}
              onEdit={() => handleEdit("email")}
              onSave={() => handleSave("email")}
              onCancel={() => handleCancel("email")}
              onChange={(val) => setEditValues((p) => ({ ...p, email: val }))}
              inputType="email"
              placeholder="Enter email"
            />

            {/* ── EDITABLE: Username ── */}
            <AccountRow
              field="username"
              label="Username"
              value={editValues.username}
              isEditing={editingField === "username"}
              onEdit={() => handleEdit("username")}
              onSave={() => handleSave("username")}
              onCancel={() => handleCancel("username")}
              onChange={(val) =>
                setEditValues((p) => ({ ...p, username: val }))
              }
              inputType="text"
              placeholder="Enter username"
            />

            {/* ── EDITABLE: Gender ── */}
            <AccountRow
              field="gender"
              label="Gender"
              value={editValues.gender}
              isEditing={editingField === "gender"}
              onEdit={() => handleEdit("gender")}
              onSave={() => handleSave("gender")}
              onCancel={() => handleCancel("gender")}
              onChange={(val) => setEditValues((p) => ({ ...p, gender: val }))}
              inputType="select"
              selectOptions={["Male", "Female", "Other"]}
            />

            {/* ── EDITABLE: Date of Birth ── */}
            {/* <AccountRow
              field="dateOfBirth"
              label="Date of Birth"
              value={editValues.dateOfBirth}
              isEditing={editingField === "dateOfBirth"}
              onEdit={() => handleEdit("dateOfBirth")}
              onSave={() => handleSave("dateOfBirth")}
              onCancel={() => handleCancel("dateOfBirth")}
              onChange={(val) =>
                setEditValues((p) => ({ ...p, dateOfBirth: val }))
              }
              inputType="date"
            /> */}
            {/* ── EDITABLE: Date of Birth (Custom Calendar) ── */}
            <div className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap">
              <span className="text-xs md:text-[14px] text-zinc-500 tracking-wide min-w-[110px]">
                Date of Birth
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {editingField !== "dateOfBirth" ? (
                  <>
                    <span
                      className={`text-xs md:text-[13px] font-medium ${editValues.dateOfBirth ? "text-zinc-300" : "text-zinc-600 italic"}`}
                    >
                      {editValues.dateOfBirth
                        ? moment(editValues.dateOfBirth).format("DD-MM-YYYY")
                        : "Not set"}
                    </span>
                    <button
                      onClick={() => handleEdit("dateOfBirth")}
                      className="w-[26px] h-[26px] flex items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all duration-200 hover:scale-105 cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <CustomDatePicker
                      value={editValues.dateOfBirth}
                      onChange={(val) =>
                        setEditValues((p) => ({ ...p, dateOfBirth: val }))
                      }
                    />
                    <button
                      onClick={() => handleSave("dateOfBirth")}
                      disabled={
                        !isSaveEnabled("dateOfBirth") ||
                        updateAccountDetailsMutation.isPending
                      }
                      className={`flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-lg text-white border-none transition-all duration-200 whitespace-nowrap min-w-[74px] justify-center ${isSaveEnabled("dateOfBirth") ? "bg-gradient-to-r from-orange-500 to-red-600 cursor-pointer hover:opacity-90 hover:scale-[1.03] active:scale-95 shadow-[0_0_14px_rgba(249,115,22,0.3)]" : "bg-zinc-700 cursor-not-allowed opacity-40"}`}
                    >
                      {updateAccountDetailsMutation.isPending ? (
                        <div className="w-[10px] h-[10px] rounded-full border-[1.8px] border-white/20 border-t-white border-r-white animate-spin shrink-0" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => handleCancel("dateOfBirth")}
                      className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-pointer hover:bg-zinc-700 hover:text-zinc-200 transition-all duration-200 whitespace-nowrap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ── READ-ONLY: Account Status ── */}
            <ReadOnlyRow
              label="Account Status"
              value={currentUser?.accountStatus || "ACTIVE"}
              isBadge
            />

            {/* ── READ-ONLY: Last Login ── */}
            <ReadOnlyRow
              label="Last Login"
              value={
                currentUser?.lastLoginAt
                  ? moment(currentUser?.lastLoginAt).format(
                      "DD MMM YYYY, hh:mm a",
                    )
                  : "—"
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfilePage;
