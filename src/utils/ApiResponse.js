export const ApiResponse = (
  status,
  message = "success",
  success = true,
  data,
  error,
) => {
  const response = {
    status,
    message,
    success: status === 200 || status === 201 ? true : false,
    data,
    error,
  };
  return response;
};
