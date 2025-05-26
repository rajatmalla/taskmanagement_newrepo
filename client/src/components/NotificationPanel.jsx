import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetNotificationsQuery,
  useMarkNotiAsReadMutation,
  useDeleteNotificationMutation,
} from "../redux/slices/api/userApiSlice";
import ViewNotification from "./ViewNotification";

const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const { data, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkNotiAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const viewHandler = (el) => {
    setSelected(el);
    if (!el.isRead?.includes(user?._id)) {
    readHandler("one", el._id);
    }
    setOpen(true);
  };

  const readHandler = async (type, id) => {
    try {
    await markAsRead({ type, id }).unwrap();
    refetch();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const callsToAction = [
    { name: "Clear All", href: "#", icon: "", onClick: () => deleteHandler("all") },
    {
      name: "Mark All Read",
      href: "#",
      icon: "",
      onClick: () => readHandler("all", ""),
    },
  ];

  return (
    <>
      <Popover className='relative'>
        <Popover.Button className='inline-flex items-center outline-none'>
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 dark:text-white relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {data?.filter(notification => !notification.isRead?.includes(user?._id))?.length > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {data?.filter(notification => !notification.isRead?.includes(user?._id))?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
            {({ close }) => (
                <div className='w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white dark:bg-[#1f1f1f] text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                  <div className='p-4'>
                  {data?.length > 0 ? (
                    data?.slice(0, 5).map((item, index) => (
                      <div
                        key={item._id + index}
                        className={`group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-[#1c1c1c] ${
                          item.isRead?.includes(user?._id) ? 'opacity-70' : ''
                        }`}
                      >
                        <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                          {ICONS[item.notiType]}
                        </div>

                        <div
                          className='cursor-pointer flex-1'
                          onClick={() => viewHandler(item)}
                        >
                          <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize dark:text-gray-200'>
                            <p> {item.notiType}</p>
                            <span className='text-xs font-normal lowercase'>
                              {moment(item.createdAt).fromNow()}
                            </span>
                            {item.isRead?.includes(user?._id) && (
                              <span className='text-xs text-gray-500'>• Read</span>
                            )}
                          </div>
                          <p className={`line-clamp-1 mt-1 text-gray-600 dark:text-gray-500 ${!item.isRead?.includes(user?._id) ? 'font-bold' : ''}`}>
                            {item.text}
                          </p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteHandler(item._id);
                          }}
                          className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full'
                        >
                          <IoMdClose className='h-4 w-4 text-gray-500 hover:text-red-500' />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className='flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400'>
                      <IoIosNotificationsOutline className='text-4xl mb-2' />
                      <p className='text-center'>No notifications</p>
                      <p className='text-sm text-center mt-1'>You're all caught up!</p>
                    </div>
                  )}
                  </div>

                {data?.length > 0 && (
                  <div className='grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 dark:bg-[#1f1f1f]'>
                    {callsToAction.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.onClick();
                          close();
                        }}
                        className='flex items-center justify-center gap-x-2.5 p-3 font-semibold text-blue-600 hover:bg-gray-100 dark:hover:bg-[#1c1c1c]'
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
                </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
      <ViewNotification open={open} setOpen={setOpen} el={selected} />
    </>
  );
}