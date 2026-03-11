const axios = require('axios');
const cheerio = require('cheerio');

class FiledonExtractor {
    constructor() {
        this.client = axios.create({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            },
            timeout: 10000
        });
    }

    async extract(embedUrl) {
        try {
            const response = await this.client.get(embedUrl);
            const $ = cheerio.load(response.data);
            const appDataRaw = $('#app').attr('data-page');

            if (!appDataRaw) throw new Error("ERR_DATA_NOT_FOUND");

            const { props, version } = JSON.parse(appDataRaw);

            if (!props.url) throw new Error("ERR_LINK_NOT_FOUND");

            return {
                success: true,
                data: {
                    name: props.files ? props.files.name : 'Unknown',
                    size: this._formatBytes(props.files ? props.files.size : 0),
                    mime: props.files ? props.files.mime_type : 'video/mp4',
                    url: props.url,
                    slug: props.slug,
                    ver: version
                }
            };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }

    _formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

module.exports = FiledonExtractor;

if (require.main === module) {
    const extractor = new FiledonExtractor();
    const target = 'https://filedon.co/embed/nghIQVrvUG';
    extractor.extract(target).then(res => console.log(JSON.stringify(res, null, 2)));
}
