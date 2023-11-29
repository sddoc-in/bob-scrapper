import cheerio from 'cheerio';

function GetNumberOfPartners(html) {
    const $ = cheerio.load(html);
    const numOfPartnersElement = $('.buy-block__alternative-sellers-card__title:contains("partners")');
    const numOfPartners = numOfPartnersElement.text().trim() || '1';
    const numberPart = numOfPartners.match(/\d+/); // This regex extracts one or more digits
    const extractedNumber = numberPart ? numberPart[0] : 1;

    console.log(extractedNumber);
    return extractedNumber;
}

export default GetNumberOfPartners;
