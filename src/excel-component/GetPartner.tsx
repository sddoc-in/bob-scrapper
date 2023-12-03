//@ts-ignore
import cheerio from 'cheerio'
import { BASE_API_URL, corsProxy } from '../constant/data';

export default async function GetNumberOfPartners(url: string) {
    try {
        // const response = await fetch(url);
        const response = await fetch(corsProxy + encodeURI(url));
        // const response = await fetch(`https://proxy.cors.sh/${url}`, {
        //     headers: {
        //       "x-cors-api-key": "temp_17866fb10689a4d54b9c6d05eb9d2a25",
        //     },
        //   });
        const html = await response.text();
        const $ = cheerio.load(html);
        const numOfPartnersElement = $('.buy-block__alternative-sellers-card__title:contains("partners")');
        const numOfPartners = numOfPartnersElement.text().trim() || '1';
        const numberPart = numOfPartners.match(/\d+/); // This regex extracts one or more digits
        const extractedNumber = numberPart ? numberPart[0] : 1;

        return extractedNumber;
    } catch (e) {
        console.log(e);
        return 1;
    }

}



