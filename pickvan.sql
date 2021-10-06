-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 06, 2021 at 12:07 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pickvan`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_account`
--

CREATE TABLE `bank_account` (
  `bank_account_id` varchar(15) NOT NULL,
  `bank_name` text NOT NULL,
  `owner_name` text NOT NULL,
  `bank_img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bank_account`
--

INSERT INTO `bank_account` (`bank_account_id`, `bank_name`, `owner_name`, `bank_img`) VALUES
('0433480414', 'ธนาคารกสิกรไทย', 'นายวรพงษ์ สุนทรพัฒนพิมล', ''),
('2782321415', 'ธนาคารไทยพาณิชย์', 'นายวรพงษ์ สุนทรพัฒนพิมล', '');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `customer_userName` varchar(20) NOT NULL,
  `customer_email` varchar(20) NOT NULL,
  `customer_phone_num` varchar(10) NOT NULL,
  `customer_password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `customer_userName`, `customer_email`, `customer_phone_num`, `customer_password`) VALUES
(0, 'walkin', 'walkin', 'walkin', 'walkin'),
(1, 'may', 'may@gmail.com', '0867357294', '123456789'),
(2, 'nan', 'nan@gmail.com', '0859258932', '123456789'),
(3, 'golf', 'golf@gmail.com', '0986850277', '1234567890');

-- --------------------------------------------------------

--
-- Table structure for table `destination`
--

CREATE TABLE `destination` (
  `destination_id` int(10) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `destination`
--

INSERT INTO `destination` (`destination_id`, `name`) VALUES
(1, 'กรุงเทพ-บางแสน'),
(2, 'กรุงเทพ-พัทยา');

-- --------------------------------------------------------

--
-- Table structure for table `destination_detail`
--

CREATE TABLE `destination_detail` (
  `destination_id` int(10) NOT NULL,
  `pick_point` varchar(50) NOT NULL,
  `state` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `destination_detail`
--

INSERT INTO `destination_detail` (`destination_id`, `pick_point`, `state`) VALUES
(1, 'บิกซีบางนา', 1),
(1, 'เซนทรัลบางนา', 1),
(1, 'เมกกาบางนา', 1),
(1, 'สำนักงานสรรพากรพื้นที่', 1),
(1, 'แม็คโครบางพลี', 1),
(2, 'แม็คโครบางพลี', 1),
(2, 'สำนักงานสรรพากรพื้นที่', 1),
(2, 'เมกกาบางนา', 1),
(2, 'เซนทรัลบางนา', 1),
(2, 'บิกซีบางนา', 1),
(2, 'แยกบางนา', 1),
(1, 'แม็คโครชลบุรี', 2),
(1, 'โรงพยาบาลชลบุรี', 2),
(1, 'ตลาดหนองมน', 2),
(1, 'มหาวิทยาลับบูรพา', 2),
(1, 'หาดวอน', 2),
(2, 'แม็คโครชลบุรี', 2),
(2, 'โรงพยาบาลชลบุรี', 2),
(2, 'ตลาดหนองมน', 2),
(1, 'แยกบางนา', 1),
(2, 'บางพระ', 2),
(2, 'ศรีราชา', 2),
(2, 'อ่าวอุดม', 2),
(2, 'แหลมฉบัง', 2),
(2, 'โรงโป๊ะ', 2),
(2, 'นาเกลือ', 2);

-- --------------------------------------------------------

--
-- Table structure for table `driver`
--

CREATE TABLE `driver` (
  `driver_id` varchar(10) NOT NULL,
  `driver_email` varchar(50) NOT NULL,
  `driver_password` varchar(50) NOT NULL,
  `driver_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `driver`
--

INSERT INTO `driver` (`driver_id`, `driver_email`, `driver_password`, `driver_name`) VALUES
('Dv1', 'pee@gmail.com', '123456789', 'นายพีรพัฒน์ กุลกิจ'),
('Dv2', 'jak@gmail.com', '123456789', 'นายจักรพงษ์ ลาสว่าง\r\n'),
('Dv3', 'ai@gmail.com', '123456789', 'นายอำนาจ แซ่ซิ้ม');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `schedule_id` int(11) NOT NULL,
  `time` time(4) NOT NULL,
  `date` date NOT NULL,
  `price` int(100) NOT NULL,
  `license_plate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `time`, `date`, `price`, `license_plate`) VALUES
(48, '13:00:00.0000', '2021-10-05', 111, 'บบ0753'),
(53, '09:00:00.0000', '2021-10-05', 120, 'กก1234'),
(54, '15:00:00.0000', '2021-10-05', 120, 'รร5678'),
(55, '12:00:00.0000', '2021-10-05', 160, 'บบ0753'),
(56, '09:00:00.0000', '2021-10-06', 120, 'กก1234'),
(57, '15:00:00.0000', '2021-10-06', 120, 'รร5678'),
(58, '12:00:00.0000', '2021-10-06', 160, 'บบ0753'),
(59, '09:00:00.0000', '2021-10-07', 120, 'กก1234'),
(60, '15:00:00.0000', '2021-10-07', 120, 'รร5678'),
(61, '12:00:00.0000', '2021-10-07', 160, 'บบ0753'),
(62, '19:00:00.0000', '2021-10-06', 150, 'รร5678'),
(63, '09:00:00.0000', '2021-10-07', 120, 'กก1234'),
(64, '15:00:00.0000', '2021-10-07', 120, 'รร5678'),
(65, '12:00:00.0000', '2021-10-07', 160, 'บบ0753');

-- --------------------------------------------------------

--
-- Table structure for table `seller`
--

CREATE TABLE `seller` (
  `seller_id` varchar(10) NOT NULL,
  `seller_mail` varchar(30) NOT NULL,
  `seller_password` varchar(20) NOT NULL,
  `seller_name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `seller`
--

INSERT INTO `seller` (`seller_id`, `seller_mail`, `seller_password`, `seller_name`) VALUES
('Se1', 'se1@gmail.com', '123456789', 'ท่ารถบางนา'),
('Se2', 'se2@gmail.com', '123456789', 'ท่ารถพระราม2');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `status_id` int(2) NOT NULL,
  `status_detail` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`status_id`, `status_detail`) VALUES
(0, 'ยังไม่ชำระเงิน'),
(1, 'รอการตรวจสอบ'),
(2, 'ผ่าน'),
(3, 'ยกเลิก');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_id` int(11) NOT NULL,
  `customer_id` int(10) NOT NULL,
  `schedule_id` varchar(10) NOT NULL,
  `pickup_point` varchar(50) NOT NULL,
  `getdown_point` varchar(50) NOT NULL,
  `seat_amount` int(10) NOT NULL,
  `receipt_img` varchar(100) NOT NULL,
  `status_id` int(5) NOT NULL,
  `time_on_buy` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `time_exp` bigint(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`ticket_id`, `customer_id`, `schedule_id`, `pickup_point`, `getdown_point`, `seat_amount`, `receipt_img`, `status_id`, `time_on_buy`, `time_exp`) VALUES
(42, 0, '48', '', 'แม็คโครชลบุรี', 5, '', 3, '2021-10-05 14:36:50', 2021105213640),
(43, 0, '53', '', 'แม็คโครชลบุรี', 4, '', 3, '2021-10-05 14:37:10', 2021105213651),
(44, 0, '56', '', 'แม็คโครชลบุรี', 1, '', 2, '2021-10-06 08:32:39', 2021106145951),
(45, 0, '56', '', 'แม็คโครชลบุรี', 1, '', 2, '2021-10-06 08:34:09', 2021106145952),
(46, 0, '56', '', 'แม็คโครชลบุรี', 1, '', 2, '2021-10-06 08:39:31', 2021106145955),
(47, 0, '56', '', 'แม็คโครชลบุรี', 3, '', 1, '2021-10-06 08:16:57', 2021106145958),
(48, 0, '56', '', 'แม็คโครชลบุรี', 1, '', 2, '2021-10-06 08:01:16', 202110615116);

-- --------------------------------------------------------

--
-- Table structure for table `van`
--

CREATE TABLE `van` (
  `license_plate` varchar(10) NOT NULL,
  `driver_id` varchar(10) NOT NULL,
  `destination_id` varchar(10) NOT NULL,
  `van_seat` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `van`
--

INSERT INTO `van` (`license_plate`, `driver_id`, `destination_id`, `van_seat`) VALUES
('กก1234', 'Dv1', '01', 13),
('บบ0753', 'Dv3', '02', 20),
('รร5678', 'Dv2', '01', 13);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_account`
--
ALTER TABLE `bank_account`
  ADD PRIMARY KEY (`bank_account_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `destination`
--
ALTER TABLE `destination`
  ADD PRIMARY KEY (`destination_id`);

--
-- Indexes for table `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`driver_id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`);

--
-- Indexes for table `seller`
--
ALTER TABLE `seller`
  ADD PRIMARY KEY (`seller_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`ticket_id`);

--
-- Indexes for table `van`
--
ALTER TABLE `van`
  ADD PRIMARY KEY (`license_plate`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `ticket_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
