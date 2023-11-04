export const baseResp = (errorCode, errorMessage, result) => {
    if (result) {
        return {
            error_schema: {
                error_code: errorCode,
                error_message: errorMessage
            },
            output_schema: result
        }
    } else {
        return {
            error_schema: {
                error_code: errorCode,
                error_message: errorMessage
            }
        }
    }
}

export const badRequestResp = {
    error_schema: {
        error_code: 400,
        error_message: "Bad Request"
    }
}

export const unauthorizedResp = {
    error_schema: {
        error_code: 401,
        error_message: "Unauthorized"
    }
}

export const invalidTokenResp = {
    error_schema: {
        error_code: 402,
        error_message: "Invalid Token"
    }
}

export const errorResp = (message) => {
    return {
        error_schema: {
            error_code: 500,
            error_message: message
        }
    }
}