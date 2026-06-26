export const ApiResponse = (
  status,
  message = "success",
  data,
  error,
  ...rest
) => {
  const response = {
    status,
    success: status === 200 || status === 201 ? true : false,
    message,
    data,
    error,
    ...rest,
  };
  return response;
};
