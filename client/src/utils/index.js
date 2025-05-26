export const formatDate = (date) => {
  if (!date || isNaN(new Date(date).getTime())) {
    return "Invalid Date";
  }

  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  return `${day} ${month} ${year}`;
};

export function dateFormatter(dateString) {
  const inputDate = new Date(dateString);

  if (isNaN(inputDate)) {
    return "Invalid Date";
  }

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function getInitials(fullName) {
  if (!fullName) return '';
  
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map((name) => name[0]?.toUpperCase() || '');
  return initials.join("");
}

export const updateURL = ({ searchTerm, navigate, location }) => {
  const params = new URLSearchParams();

  if (searchTerm) {
    params.set("search", searchTerm);
  }

  const newURL = `${location?.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

export const PRIOTITYSTYELS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

export const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

export const BGS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];

export const getCompletedSubTasks = (items) => {
  const totalCompleted = items?.filter((item) => item?.isCompleted).length;

  return totalCompleted;
};

export function countTasksByStage(tasks) {
  let inProgressCount = 0;
  let todoCount = 0;
  let completedCount = 0;

  tasks?.forEach((task) => {
    switch (task.stage.toLowerCase()) {
      case "in progress":
        inProgressCount++;
        break;
      case "todo":
        todoCount++;
        break;
      case "completed":
        completedCount++;
        break;
      default:
        break;
    }
  });

  return {
    inProgress: inProgressCount,
    todo: todoCount,
    completed: completedCount,
  };
}

// Gravatar URL generator
export function getGravatarUrl(email, size = 32) {
  if (!email) return null;
  // Simple md5 implementation for gravatar
  function md5(str) {
    return window.crypto && window.crypto.subtle
      ? '' // For brevity, use a placeholder if no md5 lib is present
      : '';
  }
  // If you have a real md5 function, use it here. For now, fallback to initials only.
  // const hash = md5(email.trim().toLowerCase());
  // return `https://www.gravatar.com/avatar/${hash}?d=404&s=${size}`;
  return null;
}