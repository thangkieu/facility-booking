import { tryParseJson } from 'lib/tryParseJSON';
import { NextApiRequest, NextApiResponse } from 'next';

import { Sentry } from '@lib/sentry-config';
import { facilityModel } from '@models/facility';

export default async function routeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await facilityModel.book(tryParseJson(req.body));

    return res.status(200).json(data);
  } catch (e: any) {
    if (e.code) {
      return res.status(e.code).json({ message: e.message });
    }

    Sentry.captureException(e);
    console.error('Facility/Reserve::ERROR', e);
    return res
      .status(500)
      .json({ message: 'Something went wrong. Please try again later.' });
  }
}
