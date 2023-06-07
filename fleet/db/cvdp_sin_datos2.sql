-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-11-2022 a las 17:47:52
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cvdp_sin_datos_2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `abonos`
--

CREATE TABLE `abonos` (
  `id` int(11) NOT NULL,
  `granja` int(11) DEFAULT NULL,
  `placa` varchar(10) DEFAULT NULL,
  `conductor` bigint(20) DEFAULT NULL,
  `destino` varchar(50) DEFAULT NULL,
  `kilos_totales` varchar(10) DEFAULT NULL,
  `costo_flete` varchar(10) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `authtoken_token`
--

CREATE TABLE `authtoken_token` (
  `key` varchar(40) NOT NULL,
  `created` datetime(6) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group`
--

CREATE TABLE `auth_group` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_group_permissions`
--

CREATE TABLE `auth_group_permissions` (
  `id` bigint(20) NOT NULL,
  `group_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_permission`
--

CREATE TABLE `auth_permission` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `content_type_id` int(11) NOT NULL,
  `codename` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_groups`
--

CREATE TABLE `auth_user_groups` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auth_user_user_permissions`
--

CREATE TABLE `auth_user_user_permissions` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacidad_carga`
--

CREATE TABLE `capacidad_carga` (
  `placa` varchar(10) NOT NULL,
  `ruta` varchar(5) NOT NULL,
  `peso_vacio` double DEFAULT NULL,
  `capacidad_carga` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_operacion`
--

CREATE TABLE `centros_operacion` (
  `codigo` varchar(5) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `codigo_ciudad` varchar(5) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contacto` varchar(50) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_operacion_usuario`
--

CREATE TABLE `centros_operacion_usuario` (
  `id` bigint(20) NOT NULL,
  `centrosoperacion_id` varchar(5) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `codigo` varchar(5) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `codigo_departamento` varchar(2) DEFAULT NULL,
  `id_zona` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `costos_viaje`
--

CREATE TABLE `costos_viaje` (
  `id` int(11) NOT NULL,
  `origen` varchar(5) NOT NULL,
  `destino` varchar(5) NOT NULL,
  `id_linea` bigint(20) NOT NULL,
  `toneladas` double DEFAULT NULL,
  `combustible` double DEFAULT NULL,
  `peajes` double DEFAULT NULL,
  `alimentacion` double DEFAULT NULL,
  `soat` double DEFAULT NULL,
  `gasto_operativo` double DEFAULT NULL,
  `gasto_mantenimiento` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `codigo` varchar(2) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dev_remision`
--

CREATE TABLE `dev_remision` (
  `id_dev_remision` bigint(20) NOT NULL,
  `unidad_negocio` int(11) DEFAULT NULL,
  `canastillas` bigint(20) DEFAULT NULL,
  `kilos` bigint(20) DEFAULT NULL,
  `unidades` bigint(20) DEFAULT NULL,
  `id_remision` bigint(20) DEFAULT NULL,
  `observaciones` varchar(100) DEFAULT NULL,
  `id_tercero` bigint(20) DEFAULT NULL,
  `id_centro_operacion` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_admin_log`
--

CREATE TABLE `django_admin_log` (
  `id` int(11) NOT NULL,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext DEFAULT NULL,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) UNSIGNED NOT NULL CHECK (`action_flag` >= 0),
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_content_type`
--

CREATE TABLE `django_content_type` (
  `id` int(11) NOT NULL,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_migrations`
--

CREATE TABLE `django_migrations` (
  `id` bigint(20) NOT NULL,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `django_session`
--

CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doc_remision`
--

CREATE TABLE `doc_remision` (
  `id_remision` bigint(20) DEFAULT NULL,
  `id_tipo_doc` varchar(3) DEFAULT NULL,
  `numero_doc` bigint(20) DEFAULT NULL,
  `kilos` double DEFAULT NULL,
  `unidades` bigint(20) DEFAULT NULL,
  `producto` int(11) DEFAULT NULL,
  `canastillas` bigint(20) DEFAULT NULL,
  `sellos` bigint(20) DEFAULT NULL,
  `unidad_negocio` int(11) DEFAULT NULL,
  `codigo_ciudad` varchar(5) DEFAULT NULL,
  `id_doc_remision` bigint(20) NOT NULL,
  `id_tercero` bigint(20) DEFAULT NULL,
  `id_centro_operacion` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `domicilios`
--

CREATE TABLE `domicilios` (
  `id` int(11) NOT NULL,
  `placa` varchar(10) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `kilos` varchar(10) DEFAULT NULL,
  `observacion` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `nit` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contacto` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `codigo_ciudad` varchar(5) DEFAULT NULL,
  `predeterminada` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fleet_app_inventarios`
--

CREATE TABLE `fleet_app_inventarios` (
  `id` bigint(20) NOT NULL,
  `fecha_corte` date NOT NULL,
  `hora_inicial` time(6) NOT NULL,
  `hora_final` time(6) NOT NULL,
  `nombre_persona` varchar(200) NOT NULL,
  `cargo_persona` varchar(100) NOT NULL,
  `observaciones` varchar(200) DEFAULT NULL,
  `centro_operacion_id` varchar(5) DEFAULT NULL,
  `usuario_responsable_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fleet_app_inventariositems`
--

CREATE TABLE `fleet_app_inventariositems` (
  `id` bigint(20) NOT NULL,
  `stock` int(11) NOT NULL,
  `toma_fisica` int(11) NOT NULL,
  `inventario_id` bigint(20) NOT NULL,
  `item_embalaje_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fleet_app_itemembalaje`
--

CREATE TABLE `fleet_app_itemembalaje` (
  `id` bigint(20) NOT NULL,
  `codigo` varchar(200) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `granjas`
--

CREATE TABLE `granjas` (
  `id` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `nombre_granja` varchar(100) NOT NULL,
  `area_cria` varchar(20) NOT NULL,
  `activo` varchar(20) NOT NULL,
  `etapa_granja` varchar(20) NOT NULL,
  `tipo_especies` varchar(20) NOT NULL,
  `nombre_propietario` varchar(100) DEFAULT NULL,
  `tipo_granja` varchar(20) NOT NULL,
  `tipo_granjero` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lineas`
--

CREATE TABLE `lineas` (
  `id_linea` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id_usuario` bigint(20) NOT NULL,
  `permiso` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rapipollos`
--

CREATE TABLE `rapipollos` (
  `codigo` varchar(3) NOT NULL,
  `cedula` bigint(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `placa` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `remisiones`
--

CREATE TABLE `remisiones` (
  `id_remision` bigint(20) NOT NULL,
  `fecha_expedicion` datetime DEFAULT NULL,
  `fecha_entrega` datetime DEFAULT NULL,
  `placa` varchar(10) DEFAULT NULL,
  `nit` bigint(20) DEFAULT NULL,
  `codigo_ciudad` varchar(5) DEFAULT NULL,
  `conductor` bigint(20) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `trailer` varchar(10) DEFAULT NULL,
  `fecha_despacho` datetime DEFAULT NULL,
  `peso_vacio` double DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `fecha_retorno` datetime DEFAULT NULL,
  `id_usuario_grabo` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `siscombas`
--

CREATE TABLE `siscombas` (
  `id` bigint(20) NOT NULL,
  `num_tiquete` varchar(20) NOT NULL,
  `peso_tiquete` double NOT NULL,
  `id_remision` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terceros`
--

CREATE TABLE `terceros` (
  `cedula` bigint(20) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `conductor` varchar(2) DEFAULT NULL,
  `codigo_ciudad` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_documento`
--

CREATE TABLE `tipos_documento` (
  `id` varchar(3) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_negocio`
--

CREATE TABLE `tipos_negocio` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `id_antiguo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_producto`
--

CREATE TABLE `tipos_producto` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_vehiculo`
--

CREATE TABLE `tipos_vehiculo` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` bigint(20) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `usuario` varchar(50) DEFAULT NULL,
  `clave` varchar(50) DEFAULT NULL,
  `registro` datetime DEFAULT NULL,
  `administrador` varchar(2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `exclusivo` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `placa` varchar(10) NOT NULL,
  `tipo` int(11) DEFAULT NULL,
  `marca` varchar(20) DEFAULT NULL,
  `poliza` varchar(20) DEFAULT NULL,
  `vencimiento_soat` datetime DEFAULT NULL,
  `compania_soat` varchar(50) DEFAULT NULL,
  `linea` varchar(20) DEFAULT NULL,
  `modelo` varchar(4) DEFAULT NULL,
  `furgon` varchar(20) DEFAULT NULL,
  `centro_operacion` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedores`
--

CREATE TABLE `vendedores` (
  `codigo` varchar(3) NOT NULL,
  `cedula` bigint(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `zonas`
--

CREATE TABLE `zonas` (
  `codigo` varchar(3) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `abonos`
--
ALTER TABLE `abonos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `granja` (`granja`),
  ADD KEY `conductor` (`conductor`),
  ADD KEY `placa` (`placa`);

--
-- Indices de la tabla `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD PRIMARY KEY (`key`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indices de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  ADD KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`);

--
-- Indices de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  ADD KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`);

--
-- Indices de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  ADD KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`);

--
-- Indices de la tabla `capacidad_carga`
--
ALTER TABLE `capacidad_carga`
  ADD PRIMARY KEY (`placa`,`ruta`),
  ADD KEY `ruta` (`ruta`);

--
-- Indices de la tabla `centros_operacion`
--
ALTER TABLE `centros_operacion`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `I_centros_operacion-codigo_ciudad` (`codigo_ciudad`);

--
-- Indices de la tabla `centros_operacion_usuario`
--
ALTER TABLE `centros_operacion_usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `centros_operacion_usuari_centrosoperacion_id_user_dc24de2a_uniq` (`centrosoperacion_id`,`user_id`),
  ADD KEY `centros_operacion_usuario_user_id_a7c169c6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `I_ciudades-codigo_departamento` (`codigo_departamento`),
  ADD KEY `id_zona` (`id_zona`);

--
-- Indices de la tabla `costos_viaje`
--
ALTER TABLE `costos_viaje`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_linea` (`id_linea`),
  ADD KEY `costos_viaje_ibfk_5` (`origen`),
  ADD KEY `costos_viaje_ibfk_6` (`destino`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `dev_remision`
--
ALTER TABLE `dev_remision`
  ADD PRIMARY KEY (`id_dev_remision`),
  ADD KEY `I_dev_remision-id_remision` (`id_remision`),
  ADD KEY `id_centro_operacion` (`id_centro_operacion`),
  ADD KEY `unidad_negocio` (`unidad_negocio`),
  ADD KEY `id_tercero` (`id_tercero`);

--
-- Indices de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  ADD KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`);

--
-- Indices de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`);

--
-- Indices de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `django_session`
--
ALTER TABLE `django_session`
  ADD PRIMARY KEY (`session_key`),
  ADD KEY `django_session_expire_date_a5c62663` (`expire_date`);

--
-- Indices de la tabla `doc_remision`
--
ALTER TABLE `doc_remision`
  ADD PRIMARY KEY (`id_doc_remision`),
  ADD KEY `id_centro_operacion` (`id_centro_operacion`),
  ADD KEY `id_tercero` (`id_tercero`),
  ADD KEY `unidad_negocio` (`unidad_negocio`),
  ADD KEY `codigo_ciudad` (`codigo_ciudad`),
  ADD KEY `id_tipo_doc` (`id_tipo_doc`),
  ADD KEY `id_remision` (`id_remision`),
  ADD KEY `producto` (`producto`);

--
-- Indices de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `placa` (`placa`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`nit`) USING BTREE,
  ADD KEY `codigo_ciudad` (`codigo_ciudad`);

--
-- Indices de la tabla `fleet_app_inventarios`
--
ALTER TABLE `fleet_app_inventarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fleet_app_inventario_usuario_responsable__429da24a_fk_auth_user` (`usuario_responsable_id`),
  ADD KEY `fleet_app_inventario_centro_operacion_id_f4cb85d2_fk_centros_o` (`centro_operacion_id`);

--
-- Indices de la tabla `fleet_app_inventariositems`
--
ALTER TABLE `fleet_app_inventariositems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fleet_app_inventario_inventario_id_ddc8e8a5_fk_fleet_app` (`inventario_id`),
  ADD KEY `fleet_app_inventario_item_embalaje_id_39d25bc6_fk_fleet_app` (`item_embalaje_id`);

--
-- Indices de la tabla `fleet_app_itemembalaje`
--
ALTER TABLE `fleet_app_itemembalaje`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `granjas`
--
ALTER TABLE `granjas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `lineas`
--
ALTER TABLE `lineas`
  ADD PRIMARY KEY (`id_linea`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id_usuario`,`permiso`);

--
-- Indices de la tabla `rapipollos`
--
ALTER TABLE `rapipollos`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `placa` (`placa`),
  ADD KEY `cedula` (`cedula`);

--
-- Indices de la tabla `remisiones`
--
ALTER TABLE `remisiones`
  ADD PRIMARY KEY (`id_remision`),
  ADD KEY `I_remisiones-codigo_ciudad` (`codigo_ciudad`),
  ADD KEY `conductor` (`conductor`),
  ADD KEY `nit` (`nit`),
  ADD KEY `placa` (`placa`),
  ADD KEY `trailer` (`trailer`);

--
-- Indices de la tabla `siscombas`
--
ALTER TABLE `siscombas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_remision` (`id_remision`);

--
-- Indices de la tabla `terceros`
--
ALTER TABLE `terceros`
  ADD PRIMARY KEY (`cedula`),
  ADD KEY `I_terceros-codigo_ciudad` (`codigo_ciudad`);

--
-- Indices de la tabla `tipos_documento`
--
ALTER TABLE `tipos_documento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos_negocio`
--
ALTER TABLE `tipos_negocio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos_producto`
--
ALTER TABLE `tipos_producto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos_vehiculo`
--
ALTER TABLE `tipos_vehiculo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`placa`),
  ADD KEY `tipo` (`tipo`),
  ADD KEY `centro_operacion` (`centro_operacion`);

--
-- Indices de la tabla `vendedores`
--
ALTER TABLE `vendedores`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cedula` (`cedula`);

--
-- Indices de la tabla `zonas`
--
ALTER TABLE `zonas`
  ADD PRIMARY KEY (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `abonos`
--
ALTER TABLE `abonos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_group`
--
ALTER TABLE `auth_group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `centros_operacion_usuario`
--
ALTER TABLE `centros_operacion_usuario`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `costos_viaje`
--
ALTER TABLE `costos_viaje`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `dev_remision`
--
ALTER TABLE `dev_remision`
  MODIFY `id_dev_remision` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_content_type`
--
ALTER TABLE `django_content_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `django_migrations`
--
ALTER TABLE `django_migrations`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `doc_remision`
--
ALTER TABLE `doc_remision`
  MODIFY `id_doc_remision` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `domicilios`
--
ALTER TABLE `domicilios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fleet_app_inventarios`
--
ALTER TABLE `fleet_app_inventarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fleet_app_inventariositems`
--
ALTER TABLE `fleet_app_inventariositems`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fleet_app_itemembalaje`
--
ALTER TABLE `fleet_app_itemembalaje`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `granjas`
--
ALTER TABLE `granjas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `remisiones`
--
ALTER TABLE `remisiones`
  MODIFY `id_remision` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `siscombas`
--
ALTER TABLE `siscombas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_negocio`
--
ALTER TABLE `tipos_negocio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_producto`
--
ALTER TABLE `tipos_producto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_vehiculo`
--
ALTER TABLE `tipos_vehiculo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `abonos`
--
ALTER TABLE `abonos`
  ADD CONSTRAINT `abonos_ibfk_1` FOREIGN KEY (`granja`) REFERENCES `granjas` (`id`),
  ADD CONSTRAINT `abonos_ibfk_2` FOREIGN KEY (`conductor`) REFERENCES `terceros` (`cedula`),
  ADD CONSTRAINT `abonos_ibfk_3` FOREIGN KEY (`placa`) REFERENCES `vehiculos` (`placa`);

--
-- Filtros para la tabla `authtoken_token`
--
ALTER TABLE `authtoken_token`
  ADD CONSTRAINT `authtoken_token_user_id_35299eff_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_group_permissions`
--
ALTER TABLE `auth_group_permissions`
  ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);

--
-- Filtros para la tabla `auth_permission`
--
ALTER TABLE `auth_permission`
  ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);

--
-- Filtros para la tabla `auth_user_groups`
--
ALTER TABLE `auth_user_groups`
  ADD CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  ADD CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `auth_user_user_permissions`
--
ALTER TABLE `auth_user_user_permissions`
  ADD CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  ADD CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `capacidad_carga`
--
ALTER TABLE `capacidad_carga`
  ADD CONSTRAINT `capacidad_carga_ibfk_1` FOREIGN KEY (`placa`) REFERENCES `vehiculos` (`placa`),
  ADD CONSTRAINT `capacidad_carga_ibfk_2` FOREIGN KEY (`ruta`) REFERENCES `ciudades` (`codigo`);

--
-- Filtros para la tabla `centros_operacion`
--
ALTER TABLE `centros_operacion`
  ADD CONSTRAINT `centros_operacion_ibfk_1` FOREIGN KEY (`codigo_ciudad`) REFERENCES `ciudades` (`codigo`);

--
-- Filtros para la tabla `centros_operacion_usuario`
--
ALTER TABLE `centros_operacion_usuario`
  ADD CONSTRAINT `centros_operacion_us_centrosoperacion_id_5324412b_fk_centros_o` FOREIGN KEY (`centrosoperacion_id`) REFERENCES `centros_operacion` (`codigo`),
  ADD CONSTRAINT `centros_operacion_usuario_user_id_a7c169c6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`codigo_departamento`) REFERENCES `departamentos` (`codigo`),
  ADD CONSTRAINT `ciudades_ibfk_2` FOREIGN KEY (`id_zona`) REFERENCES `zonas` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `costos_viaje`
--
ALTER TABLE `costos_viaje`
  ADD CONSTRAINT `costos_viaje_ibfk_1` FOREIGN KEY (`id_linea`) REFERENCES `lineas` (`id_linea`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `costos_viaje_ibfk_5` FOREIGN KEY (`origen`) REFERENCES `ciudades` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `costos_viaje_ibfk_6` FOREIGN KEY (`destino`) REFERENCES `ciudades` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `dev_remision`
--
ALTER TABLE `dev_remision`
  ADD CONSTRAINT `dev_remision_ibfk_1` FOREIGN KEY (`id_centro_operacion`) REFERENCES `centros_operacion` (`codigo`),
  ADD CONSTRAINT `dev_remision_ibfk_3` FOREIGN KEY (`unidad_negocio`) REFERENCES `tipos_negocio` (`id`),
  ADD CONSTRAINT `dev_remision_ibfk_4` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`cedula`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `dev_remision_ibfk_5` FOREIGN KEY (`id_remision`) REFERENCES `remisiones` (`id_remision`);

--
-- Filtros para la tabla `django_admin_log`
--
ALTER TABLE `django_admin_log`
  ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `doc_remision`
--
ALTER TABLE `doc_remision`
  ADD CONSTRAINT `doc_remision_ibfk_1` FOREIGN KEY (`id_centro_operacion`) REFERENCES `centros_operacion` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `doc_remision_ibfk_2` FOREIGN KEY (`id_tercero`) REFERENCES `terceros` (`cedula`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `doc_remision_ibfk_3` FOREIGN KEY (`unidad_negocio`) REFERENCES `tipos_negocio` (`id`),
  ADD CONSTRAINT `doc_remision_ibfk_4` FOREIGN KEY (`codigo_ciudad`) REFERENCES `ciudades` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `doc_remision_ibfk_5` FOREIGN KEY (`id_tipo_doc`) REFERENCES `tipos_documento` (`id`),
  ADD CONSTRAINT `doc_remision_ibfk_6` FOREIGN KEY (`id_remision`) REFERENCES `remisiones` (`id_remision`),
  ADD CONSTRAINT `doc_remision_ibfk_7` FOREIGN KEY (`producto`) REFERENCES `tipos_producto` (`id`);

--
-- Filtros para la tabla `domicilios`
--
ALTER TABLE `domicilios`
  ADD CONSTRAINT `domicilios_ibfk_1` FOREIGN KEY (`placa`) REFERENCES `vehiculos` (`placa`);

--
-- Filtros para la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD CONSTRAINT `empresas_ibfk_1` FOREIGN KEY (`codigo_ciudad`) REFERENCES `ciudades` (`codigo`);

--
-- Filtros para la tabla `fleet_app_inventarios`
--
ALTER TABLE `fleet_app_inventarios`
  ADD CONSTRAINT `fleet_app_inventario_centro_operacion_id_f4cb85d2_fk_centros_o` FOREIGN KEY (`centro_operacion_id`) REFERENCES `centros_operacion` (`codigo`),
  ADD CONSTRAINT `fleet_app_inventario_usuario_responsable__429da24a_fk_auth_user` FOREIGN KEY (`usuario_responsable_id`) REFERENCES `auth_user` (`id`);

--
-- Filtros para la tabla `fleet_app_inventariositems`
--
ALTER TABLE `fleet_app_inventariositems`
  ADD CONSTRAINT `fleet_app_inventario_inventario_id_ddc8e8a5_fk_fleet_app` FOREIGN KEY (`inventario_id`) REFERENCES `fleet_app_inventarios` (`id`),
  ADD CONSTRAINT `fleet_app_inventario_item_embalaje_id_39d25bc6_fk_fleet_app` FOREIGN KEY (`item_embalaje_id`) REFERENCES `fleet_app_itemembalaje` (`id`);

--
-- Filtros para la tabla `rapipollos`
--
ALTER TABLE `rapipollos`
  ADD CONSTRAINT `rapipollos_ibfk_1` FOREIGN KEY (`placa`) REFERENCES `vehiculos` (`placa`),
  ADD CONSTRAINT `rapipollos_ibfk_2` FOREIGN KEY (`cedula`) REFERENCES `terceros` (`cedula`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `remisiones`
--
ALTER TABLE `remisiones`
  ADD CONSTRAINT `remisiones_ibfk_1` FOREIGN KEY (`conductor`) REFERENCES `terceros` (`cedula`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `remisiones_ibfk_3` FOREIGN KEY (`nit`) REFERENCES `empresas` (`nit`),
  ADD CONSTRAINT `remisiones_ibfk_4` FOREIGN KEY (`placa`) REFERENCES `vehiculos` (`placa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `remisiones_ibfk_5` FOREIGN KEY (`trailer`) REFERENCES `vehiculos` (`placa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `remisiones_ibfk_6` FOREIGN KEY (`codigo_ciudad`) REFERENCES `ciudades` (`codigo`);

--
-- Filtros para la tabla `siscombas`
--
ALTER TABLE `siscombas`
  ADD CONSTRAINT `siscombas_ibfk_1` FOREIGN KEY (`id_remision`) REFERENCES `remisiones` (`id_remision`);

--
-- Filtros para la tabla `terceros`
--
ALTER TABLE `terceros`
  ADD CONSTRAINT `terceros_ibfk_1` FOREIGN KEY (`codigo_ciudad`) REFERENCES `ciudades` (`codigo`);

--
-- Filtros para la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`tipo`) REFERENCES `tipos_vehiculo` (`id`),
  ADD CONSTRAINT `vehiculos_ibfk_2` FOREIGN KEY (`centro_operacion`) REFERENCES `centros_operacion` (`codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `vendedores`
--
ALTER TABLE `vendedores`
  ADD CONSTRAINT `vendedores_ibfk_1` FOREIGN KEY (`cedula`) REFERENCES `terceros` (`cedula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
