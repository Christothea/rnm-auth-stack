export const apiErrorResponseParser = (ex: any): string => {
   return (ex.details?.length > 0 && ex.details[0].message) ? `${ex.message}: ${ex.details[0].message}` : ex.message;
}