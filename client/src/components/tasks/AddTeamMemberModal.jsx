import { Dialog } from "@headlessui/react";
import { useState } from "react";
import Button from "../Button";
import { FiLink } from "react-icons/fi";
import { toast } from "sonner";
import UserList from "./UsersSelect";

export default function AddTeamMemberModal({ open, setOpen, onAdd }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [link, setLink] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ users: selectedUsers, link });
    setOpen(false);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Invite link copied!");
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Add Team Member
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <UserList
              team={selectedUsers}
              setTeam={setSelectedUsers}
            />
            <input
              type="url"
              className="w-full border rounded px-3 py-2"
              placeholder="Website or Project link (optional)"
              value={link}
              onChange={e => setLink(e.target.value)}
            />
            <button
              type="button"
              className="flex items-center gap-2 text-blue-600 hover:underline focus:outline-none"
              onClick={handleCopyInviteLink}
            >
              <FiLink className="text-lg" />
              Copy Invite Link
            </button>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" label="Cancel" className="bg-gray-200 text-gray-700" onClick={() => setOpen(false)} />
              <Button type="submit" label="Add" className="bg-blue-600 text-white" />
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
} 