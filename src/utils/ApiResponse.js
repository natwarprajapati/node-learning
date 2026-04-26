const ApiResponse = (
    status,
    data,
    message = "Success",
    success = true,
    error
) => {
    const response = {
        status,
        data,
        message,
        success: status === 200 || status === 201 ? true : false,
        error,
    };

    return response;
};

export default ApiResponse;