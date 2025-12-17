import { useAppDispatch } from "@/store/hook";
import { useState } from "react";
import { util } from "@/services/user";
import { useRouter } from "next/navigation";

function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openLogoutPopup, setOpen] = useState(false);
  const handleOpenLogoutPopup = () => {
    setOpen(true);
  };
  const handleCloseLogoutPopup = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    handleCloseLogoutPopup();

    dispatch({
      type: "global/setAccessToken",
      payload: "",
    });

    dispatch(
      util.updateQueryData("fetchMe", "", (draft) => {
        if (draft) {
          return undefined;
        }
      }),
    );
    localStorage.removeItem("access_token");
    router.push("/auth/login");
  };
  return {
    openLogoutPopup,
    handleCloseLogoutPopup,
    handleOpenLogoutPopup,
    handleLogout,
  };
}

export default useLogout;
