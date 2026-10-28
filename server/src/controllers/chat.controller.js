const { OpenAI } = require("openai");
const Product = require("../models/product.model");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askChatbot = async (req, res) => {
  try {
    const { messages } = req.body;
    const userName = req.body.userName || "bạn";

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages are required and must be an array" });
    }

    // Lấy tối đa 10 sản phẩm không bị ẩn từ database để cung cấp ngữ cảnh cho AI
    const products = await Product.find({ isHidden: false }).limit(10).lean();
    
    // Tạo danh sách sản phẩm dạng text kèm Link
    const productContext = products.map(p => 
      `- ${p.nameProduct}: Giá ${p.priceProduct.toLocaleString('vi-VN')} VNĐ. (Link mua hàng: <a href="/product/${p._id}" style="color: #1890ff; font-weight: bold; text-decoration: underline;">Xem và Mua ngay</a>). ${p.descriptionProduct || ''}`
    ).join('\n');

    const systemInstruction = `
      Bạn là trợ lý ảo chăm sóc khách hàng độc quyền của thương hiệu trà bảo vệ sức khỏe Medi-Tea. 
      Quy tắc bắt buộc:
      1. Luôn luôn xưng hô là "Medi-Tea". Tuyệt đối không xưng là "tôi", "mình", "AI", hay "trợ lý ảo".
      2. Luôn gọi khách hàng là "${userName}".
      3. Trả lời ngắn gọn, thân thiện, lịch sự và luôn có biểu tượng cảm xúc (emoji) phù hợp.
      4. Về kiến thức trà, đây là danh sách sản phẩm THỰC TẾ của chúng tôi:
      ${productContext ? productContext : 'Trà Xanh, Trà Đen, Trà Thảo Mộc... (Dữ liệu sản phẩm đang được cập nhật).'}
      5. Nếu khách hàng ấn vào các gợi ý (Trà xanh giảm cân, Trà đen pha sữa...) nhưng Medi-Tea không có sản phẩm tên chính xác như vậy, hãy lịch sự giới thiệu các sản phẩm THỰC TẾ có công dụng tương tự từ danh sách trên.
      6. Khi khách hàng đồng ý mua hoặc hỏi mua, BẮT BUỘC trả về nội dung chứa thẻ HTML Link mua hàng của sản phẩm đó từ danh sách trên. Bạn cũng có thể đưa kèm link Giỏ hàng: <a href="/cart" style="color: #ff4d4f; font-weight: bold; text-decoration: underline;">Đến Giỏ Hàng</a>.
      7. Xử lý câu hỏi ngoài luồng (gõ bừa): Tuyệt đối không trả lời sâu. Trả lời cực kỳ ngắn gọn (1 câu) vui vẻ, sau đó BẮT BUỘC bẻ lái về giới thiệu danh sách trà.
    `;

    const openAiMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Can be changed based on preference
      messages: openAiMessages,
    });

    const aiReply = response.choices[0].message.content;

    return res.status(200).json({
      success: true,
      data: aiReply,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Dạ, hệ thống của Medi-Tea đang bận một chút để ủ trà. Bạn vui lòng thử lại sau vài giây nhé! 🍵",
    });
  }
};

module.exports = {
  askChatbot,
};
