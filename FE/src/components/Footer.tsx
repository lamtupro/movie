import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-1">
            <div className="max-w-6xl mx-auto px-4">
                <a
                    href="https://t.me/+6kYIuxQYxH02N2Y1" target="_blank"
                    className="w-fit mx-auto px-3 py-2 mt-4 flex gap-2 bg-gray-700 text-white text-center rounded-2xl shadow hover:bg-gray-600 transition duration-300"
                >
                    <img src="/telegram.svg" className="w-6 h-6" /> Vào nhóm chat telegram
                </a>
                <p className="mt-4 text-gray-300">quoclamtu.live là web xem phim dành cho người lớn trên 19 tuổi, giúp bạn giải trí, thỏa mãn sinh lý, dưới 19 tuổi xin vui lòng quay ra.

                    Trang web này không đăng tải các clip Việt Nam, video ấu dâm trẻ em,... .Nội dung phim được dàn dựng từ trước, hoàn toàn không có thật, người xem tuyệt đối không bắt chước hành động trong phim, tránh vi phạm pháp luật.</p>
                {/*     <p className='text-center my-4 text-gray-300'>Liên hệ quảng cáo</p> */}
            </div>
        </footer>
    )
}

export default Footer