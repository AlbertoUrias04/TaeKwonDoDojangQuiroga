-- Script para actualizar las cintas de Taekwondo
-- Ejecutar este script en la base de datos

-- Eliminar todas las cintas existentes
DELETE FROM Cintas;

-- Insertar las nuevas cintas
SET IDENTITY_INSERT Cintas ON;

-- Cintas de colores progresivos
INSERT INTO Cintas (Id, Nombre, Orden, ColorHex, Descripcion, Activo, Slug) VALUES
(1, 'Principiante', 1, '#808080', 'Nivel principiante', 1, 'principiante'),
(2, 'Blanca', 2, '#FFFFFF', 'Cinta blanca', 1, 'blanca'),
(3, 'Blanca Avanzada', 3, '#FFFFFF', 'Cinta blanca avanzada', 1, 'blanca-avanzada'),
(4, 'Amarilla', 4, '#FFEB3B', 'Cinta amarilla', 1, 'amarilla'),
(5, 'Amarilla Avanzada', 5, '#FFEB3B', 'Cinta amarilla avanzada', 1, 'amarilla-avanzada'),
(6, 'Verde', 6, '#4CAF50', 'Cinta verde', 1, 'verde'),
(7, 'Verde Avanzada', 7, '#4CAF50', 'Cinta verde avanzada', 1, 'verde-avanzada'),
(8, 'Azul', 8, '#2196F3', 'Cinta azul', 1, 'azul'),
(9, 'Azul Avanzada', 9, '#2196F3', 'Cinta azul avanzada', 1, 'azul-avanzada'),
(10, 'Roja', 10, '#F44336', 'Cinta roja', 1, 'roja'),
(11, 'Roja Avanzada', 11, '#F44336', 'Cinta roja avanzada', 1, 'roja-avanzada'),
(12, 'Negra 1er Poom', 12, '#000000', 'Cinta negra primer poom', 1, 'negra-1er-poom'),
(13, 'Negra 2do Poom', 13, '#000000', 'Cinta negra segundo poom', 1, 'negra-2do-poom'),
(14, 'Negra 1er Dan', 14, '#000000', 'Cinta negra primer dan', 1, 'negra-1er-dan'),
(15, 'Negra 2do Dan', 15, '#000000', 'Cinta negra segundo dan', 1, 'negra-2do-dan'),
(16, 'Negra 3er Dan', 16, '#000000', 'Cinta negra tercer dan', 1, 'negra-3er-dan');

SET IDENTITY_INSERT Cintas OFF;

-- Verificar las cintas insertadas
SELECT * FROM Cintas ORDER BY Orden;
