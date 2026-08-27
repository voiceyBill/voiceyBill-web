import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/common/routePath";
import { useLogoutMutation } from "../../features/auth/authAPI";

interface LogoutDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const LogoutDialog = ({ isOpen, setIsOpen }: LogoutDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutApi().unwrap();
      } catch (error) {
        console.error("Logout API failed:", error);
      } finally {
        setIsOpen(false);
        dispatch(logout());
        navigate(PUBLIC_ROUTES.HOME);
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to log out?</DialogTitle>
          <DialogDescription>
            This will end your current session and you will need to log in again
            to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            type="button"
            onClick={handleLogout}
          >
            {isPending && <Loader className="animate-spin" />}
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
