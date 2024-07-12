export const CreateSuccess = (statusCode, successMessage, data = null) => {
    const successObj = {
        status: statusCode,
        message: successMessage,
    };

    if (data !== null) {
        successObj.data = data;
    }

    return successObj;
};