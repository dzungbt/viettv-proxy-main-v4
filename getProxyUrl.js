
function getProxyUrl() {
    const proxy_url = 'http://103.75.185.244:3050'
    const video_url = 'https://code.vthanhtivi.pw/getlink/mytv/381/hd.m3u8'
    const file_extension = '.m3u8'

    const hls_proxy_url = `${proxy_url}/${btoa(video_url)}${file_extension}`
    console.log(hls_proxy_url);
}


module.exports = getProxyUrl;