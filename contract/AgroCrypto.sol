// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/// @title AgroRegistry
/// @author Assistant
/// @notice Este contrato permite registrar agricultores y realizar transferencias de ETH a los agricultores registrados
/// @dev Este contrato gestiona un registro de agricultores y facilita transferencias de ETH

contract AgroRegistry {
    /// @notice Estructura para almacenar los datos del agricultor
    /// @dev Contiene nombre, ubicación, dirección de wallet y estado de registro
    struct Farmer {
        string name;
        string location;
        address wallet;  // Dirección de Ethereum (wallet) del agricultor
        bool isRegistered; // Estado de registro
    }

    /// @notice Lista de direcciones de los agricultores registrados
    address[] public farmerAddresses;
    
    /// @notice Mapeo de direcciones de Ethereum a datos de agricultores
    /// @dev Permite acceder rápidamente a los datos de un agricultor por su dirección
    mapping(address => Farmer) public farmers;

    /// @notice Evento emitido cuando un agricultor es registrado
    /// @param farmerAddress La dirección del agricultor registrado
    /// @param name El nombre del agricultor
    /// @param location La ubicación del agricultor
    /// @param wallet La dirección de wallet del agricultor
    event FarmerRegistered(address indexed farmerAddress, string name, string location, address wallet);

    /// @notice Evento emitido cuando se realiza una transferencia en ETH
    /// @param recipient La dirección del destinatario
    /// @param amount La cantidad de ETH transferida
    /// @param comment Un comentario opcional sobre la transferencia
    event EtherTransferred(address indexed recipient, uint256 amount, string comment);

    /// @notice Registra a un nuevo agricultor
    /// @dev Verifica que el agricultor no esté ya registrado y que la dirección de wallet sea válida
    /// @param _name El nombre del agricultor
    /// @param _location La ubicación del agricultor
    /// @param _wallet La dirección de wallet del agricultor
    function registerFarmer(string memory _name, string memory _location, address _wallet) public {
        require(!farmers[_wallet].isRegistered, "Error: Farmer already registered");
        require(_wallet != address(0), "Error: Wallet address is invalid");
        farmers[_wallet] = Farmer(_name, _location, _wallet, true);
        farmerAddresses.push(_wallet); // Añadir al array de agricultores
        emit FarmerRegistered(_wallet, _name, _location, _wallet);
    }

    /// @notice Transfiere ETH a un agricultor registrado
    /// @dev Verifica que se envíe ETH y que el destinatario sea un agricultor registrado
    /// @param recipient La dirección del agricultor destinatario
    /// @param comment Un comentario opcional sobre la transferencia
    function transferETH(address recipient, string memory comment) public payable {
        require(msg.value > 0, "Error: Must send ETH to transfer");
        require(farmers[recipient].isRegistered, "Error: Recipient must be a registered farmer");
        // Transferir ETH al agricultor registrado
        (bool success, ) = payable(recipient).call{value: msg.value}("");
        require(success, "Error: Transfer failed");
        emit EtherTransferred(recipient, msg.value, comment);
    }

    /// @notice Obtiene los detalles de un agricultor
    /// @dev Retorna los datos almacenados para un agricultor específico
    /// @param _farmerAddress La dirección del agricultor
    /// @return name El nombre del agricultor
    /// @return location La ubicación del agricultor
    /// @return wallet La dirección de wallet del agricultor
    /// @return isRegistered El estado de registro del agricultor
    function getFarmerDetails(address _farmerAddress)
        public
        view
        returns (string memory name, string memory location, address wallet, bool isRegistered)
    {
        Farmer memory farmer = farmers[_farmerAddress];
        return (farmer.name, farmer.location, farmer.wallet, farmer.isRegistered);
    }

    /// @notice Obtiene la lista de todos los agricultores registrados
    /// @dev Retorna un array con las direcciones de todos los agricultores registrados
    /// @return Un array de direcciones de agricultores
    function getAllFarmers() public view returns (address[] memory) {
        return farmerAddresses;
    }

    /// @notice Función fallback para rechazar pagos directos al contrato
    /// @dev Revierte cualquier transacción que intente enviar ETH directamente al contrato
    receive() external payable {
        revert("Error: Direct payments not allowed.");
    }
}