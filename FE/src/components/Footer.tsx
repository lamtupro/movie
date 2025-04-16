import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                    {/* Cột 1 */}
                    <div>
                        <h3 className="text-orange-500 font-bold mb-2">Phim Hot</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:underline">Về chúng tôi</a></li>
                            <li><a href="#" className="hover:underline">######</a></li>
                            <li><a href="#" className="hover:underline">######</a></li>
                        </ul>
                    </div>

                    {/* Cột 2 */}
                    <div>
                        <h3 className="text-orange-500 font-bold mb-2">Trợ giúp</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:underline">Liên hệ quảng cáo</a></li>
                            <li><a href="#" className="hover:underline">Tin tức</a></li>
                        </ul>
                    </div>

                    {/* Cột 3 */}
                    <div>
                        <h3 className="text-orange-500 font-bold mb-2">Thông tin</h3>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:underline">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:underline">Chính sách riêng tư</a></li>
                            <li><a href="#" className="hover:underline">Khiếu nại bản quyền</a></li>
                        </ul>
                    </div>
                    
                </div>
               {/*  <p className="mt-8 text-gray-300">... là web xem phim ... dành cho người lớn trên 19 tuổi, giúp bạn giải trí, thỏa mãn sinh lý, dưới 19 tuổi xin vui lòng quay ra.

                        Trang web này không đăng tải clip ... Việt Nam, video ... trẻ em. Nội dung phim được dàn dựng từ trước, hoàn toàn không có thật, người xem tuyệt đối không bắt chước hành động trong phim, tránh vi phạm pháp luật.</p>
 */}
            </div>
        </footer>
    )
}

export default Footer