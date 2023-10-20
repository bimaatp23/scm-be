export const baseResp = (errorCode, errorMessage, result) => {
    return {
        error_schema: {
            error_code: errorCode,
            error_message: errorMessage
        },
        output_schema: result
    }
}

export const errorResp = (result) => {
    return {
        error_schema: {
            error_code: 500,
            error_message: 'Internal Server Error'
        },
        output_schema: result
    }
}