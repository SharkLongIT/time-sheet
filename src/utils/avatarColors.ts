
const avatarColors = [
    "#2563eb", // blue
    "#7c3aed", // purple
    "#db2777", // pink
    "#059669", // green
    "#ea580c", // orange
    "#0891b2", // cyan
    "#ca8a04", // yellow
    "#9333ea"  // violet
];

/**
 * Lấy màu avatar dựa theo tên
 */
export const getAvatarColor = (name?: string) => {

    if (!name) return avatarColors[0];

    const charCode = name.charCodeAt(0);

    return avatarColors[charCode % avatarColors.length];

};

/**
 * Lấy chữ cái avatar
 */
export const getAvatarLetter = (name?: string) => {

    if (!name) return "?";

    return name.charAt(0).toUpperCase();

};

