import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Context,
  // eslint-disable-next-line  @typescript-eslint/require-await
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World',
      input: event,
    }),
  };
};

// Export for use by aws lambda.
export default { handler };
