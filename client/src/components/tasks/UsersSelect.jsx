import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice.js";
import { getInitials } from "../../utils/index.js";
import Loading from "../Loading";

export default function UserList({ team, setTeam, single = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetTeamListsQuery({ search: searchTerm });
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (team?.length > 0) {
      const selectedTeamMembers = data?.filter(user => 
        team.includes(user._id)
      ) || [];
      setSelectedUsers(selectedTeamMembers);
    }
  }, [team, data]);

  const handleChange = (el) => {
    if (single) {
      setSelectedUsers(el ? [el] : []);
      setTeam(el ? [el] : []);
    } else {
      setSelectedUsers(el);
      setTeam(el.map((el) => el._id));
    }
  };

  return (
    <div className='w-full'>
      <Listbox
        value={single ? selectedUsers[0] || null : selectedUsers}
        onChange={handleChange}
        multiple={!single}
      >
        <div className='relative mt-1'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white dark:bg-[#1f1f1f] pl-3 pr-10 text-left px-3 py-2.5 border border-gray-300 dark:border-gray-600 sm:text-sm'>
            <div className='flex flex-wrap gap-1'>
              {single ? (
                selectedUsers[0] ? (
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded-full text-sm'>
                    <span className='w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs'>
                      {getInitials(selectedUsers[0].name)}
                    </span>
                    {selectedUsers[0].name}
                  </span>
                ) : (
                  <span className='text-gray-500 dark:text-gray-400'>Select user</span>
                )
              ) : (
                selectedUsers?.length > 0 ? (
                  selectedUsers.map((user) => (
                    <span
                      key={user._id}
                      className='inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm'
                    >
                      <span className='w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs'>
                        {getInitials(user.name)}
                      </span>
                      {user.name}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500 dark:text-gray-400'>Select team members</span>
                )
              )}
            </div>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <BsChevronExpand
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-[#1f1f1f] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              <div className='px-2 py-1 sticky top-0 bg-white dark:bg-[#1f1f1f] border-b border-gray-200 dark:border-gray-700'>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1f1f1f] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              {isLoading ? (
                <div className='py-4 flex justify-center'>
                  <Loading />
                </div>
              ) : data?.length === 0 ? (
                <div className='py-4 text-center text-gray-500 dark:text-gray-400'>
                  No users found
                </div>
              ) : (
                data?.map((user) => (
                  <Listbox.Option
                    key={user._id}
                    className={({ active, selected }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? (single ? "bg-yellow-100 text-yellow-900" : "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100") : (single ? "text-gray-900" : "text-gray-900 dark:text-gray-100")
                      }`
                    }
                    value={user}
                  >
                    {({ selected }) => (
                      <>
                        <div className='flex items-center gap-2'>
                          <div className={`w-8 h-8 rounded-full ${single ? "bg-purple-600" : "bg-blue-600"} text-white flex items-center justify-center text-sm`}>
                            {getInitials(user.name)}
                          </div>
                          <span className={`${selected ? "font-medium" : "font-normal"}`}>{user.name}</span>
                        </div>
                        {selected ? (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${single ? "text-yellow-600" : "text-blue-600 dark:text-blue-400"}`}>
                            <MdCheck className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}