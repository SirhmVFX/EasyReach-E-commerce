export default function generateReference() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const reference = `EASYCOMMERCE-${timestamp}-${random}`;
    return reference.substring(0, 15);
};