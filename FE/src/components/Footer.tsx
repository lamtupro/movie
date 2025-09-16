import React from 'react'

const Footer = () => {
    return (
       <footer className="bg-black text-gray-300 py-6">
  <div className="max-w-7xl mx-auto px-4 text-sm md:text-base">
    <p className="leading-relaxed text-justify">
      <span className="font-semibold text-white">quoclamtu.live</span> là web xem phim dành cho người lớn trên 19 tuổi, giúp bạn giải trí, thỏa mãn sinh lý. 
      Nếu bạn dưới 19 tuổi xin vui lòng quay ra.
    </p>

    <p className="mt-4 leading-relaxed text-justify">
      Trang web này không đăng tải các clip Việt Nam, video ấu dâm trẻ em,... 
      Nội dung phim được dàn dựng từ trước, hoàn toàn không có thật. 
      Người xem tuyệt đối không bắt chước hành động trong phim để tránh vi phạm pháp luật.
    </p>

    {/* Liên hệ quảng cáo */}
    <div className="mt-6 text-center border-t border-gray-700 pt-4">
      <p>
        LHQC Telegram:{" "}
        <span
          className="text-blue-400 hover:underline"
        >
          @conganxaxx
        </span>
      </p>
    </div>
  </div>
</footer>

    )
}

export default Footer