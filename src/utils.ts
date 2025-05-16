export const serialize = (data: object) => {
  window.localStorage.setItem("todos", JSON.stringify(data));
};
