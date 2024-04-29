export function formatDate(content: number, isNotTime: boolean) {
    // 创建一个Date对象，将时间戳转换为日期
    var date = new Date(content);

    // 获取年、月、日、小时和分钟
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0'); // 使用padStart补齐到两位数
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');

    // 根据isNotTime判断是否需要显示时间
    var formattedDate = isNotTime ? `${year}-${month}-${day}` : `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDate;
}