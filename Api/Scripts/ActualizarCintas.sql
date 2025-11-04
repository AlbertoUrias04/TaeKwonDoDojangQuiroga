-- Script para actualizar las cintas de Taekwondo
-- Ejecutar este script en la base de datos

-- Eliminar cintas existentes que no sean negras
DELETE FROM Cintas WHERE Nombre NOT LIKE '%Negra%' AND Nombre NOT LIKE '%Negro%';

-- Insertar las nuevas cintas
SET IDENTITY_INSERT Cintas ON;

-- Cintas de colores progresivos
INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
(1, 'Blanca', 1, '#FFFFFF', 'Cinta blanca - Nivel inicial', 1, 'blanca'),
(2, 'Blanca con punta amarilla', 2, '#FFFFFF', 'Cinta blanca con punta amarilla', 1, 'blanca-con-punta-amarilla'),
(3, 'Amarilla', 3, '#FFEB3B', 'Cinta amarilla', 1, 'amarilla'),
(4, 'Amarilla con punta verde', 4, '#FFEB3B', 'Cinta amarilla con punta verde', 1, 'amarilla-con-punta-verde'),
(5, 'Verde', 5, '#4CAF50', 'Cinta verde', 1, 'verde'),
(6, 'Verde con punta azul', 6, '#4CAF50', 'Cinta verde con punta azul', 1, 'verde-con-punta-azul'),
(7, 'Azul', 7, '#2196F3', 'Cinta azul', 1, 'azul'),
(8, 'Azul con punta roja', 8, '#2196F3', 'Cinta azul con punta roja', 1, 'azul-con-punta-roja'),
(9, 'Roja', 9, '#F44336', 'Cinta roja', 1, 'roja'),
(10, 'Roja con punta negra', 10, '#F44336', 'Cinta roja con punta negra', 1, 'roja-con-punta-negra');

-- Cintas negras (mantener las existentes o agregar si no existen)
IF NOT EXISTS (SELECT 1 FROM Cintas WHERE Nombre = 'Negra 1er Dan')
BEGIN
    INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
    (11, 'Negra 1er Dan', 11, '#000000', 'Cinta negra primer dan', 1, 'negra-1er-dan');
END

IF NOT EXISTS (SELECT 1 FROM Cintas WHERE Nombre = 'Negra 2do Dan')
BEGIN
    INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
    (12, 'Negra 2do Dan', 12, '#000000', 'Cinta negra segundo dan', 1, 'negra-2do-dan');
END

IF NOT EXISTS (SELECT 1 FROM Cintas WHERE Nombre = 'Negra 3er Dan')
BEGIN
    INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
    (13, 'Negra 3er Dan', 13, '#000000', 'Cinta negra tercer dan', 1, 'negra-3er-dan');
END

IF NOT EXISTS (SELECT 1 FROM Cintas WHERE Nombre = 'Negra 4to Dan')
BEGIN
    INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
    (14, 'Negra 4to Dan', 14, '#000000', 'Cinta negra cuarto dan', 1, 'negra-4to-dan');
END

SET IDENTITY_INSERT Cintas OFF;

-- Verificar las cintas insertadas
SELECT * FROM Cintas ORDER BY Orden;
