// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/IAccessControl.sol";

error NotAuthorized();

/**
 * @title SoladayRegistry
 * @dev 
 * @author kethcode (https://github.com/kethcode)
 */
contract SoladayAccessControl is IAccessControl {

    /***********
    * Contants *
    ************/

    // we will want roles eventually
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    /*********
    * Events *
    **********/

    /************
    * Variables *
    *************/

    // so this class maps a role to an account?  an account to a role?
    // roles are bytes32 constants
    // so a mapping(bytes32 => mapping(addresses => bool))?
    // given a role, we need to a list of addresses that have that role.

    // ew, grantRole only works if the msg.sender has an admin role for the role.
    // we need another word for role.
    // mapping(bytes32 => address)

    // ah, two mapping that both enter on the role identifier
    // that means we need a struct

    // hrm, ok. we want to allow more than one user to be admin, sowe need to allow
    // entire roles to be admins of other roles.  this feels weird.
    struct RoleStruct {
        bytes32 adminRole;
        mapping(address => bool) members;
    }

    mapping(bytes32 => RoleStruct) roles;

    /************
    * Modifiers *
    *************/
    modifier adminRequired(bytes32 role)
    {
        if(roles[roles[role].adminRole].members[msg.sender] == false) revert NotAuthorized();
        _;
    }

    modifier selfRequired(address account)
    {
        if(msg.sender != account) revert NotAuthorized();
        _;
    }

    /*******************
    * Public Functions *
    ********************/

    constructor ()
    {
        // it('should give the deployer the default admin role', () => {
        // it('the admin of any other role is the default admin role', async() => {
        roles[DEFAULT_ADMIN_ROLE].adminRole = DEFAULT_ADMIN_ROLE;
        roles[USER_ROLE].adminRole = DEFAULT_ADMIN_ROLE;
        // _setRoleAdmin(DEFAULT_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
        // _setRoleAdmin(USER_ROLE, DEFAULT_ADMIN_ROLE);

        roles[DEFAULT_ADMIN_ROLE].members[msg.sender] = true;
        // grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool)
    {
        return roles[role].members[account];
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32)
    {
        return roles[role].adminRole;
    }

    // As stated above, To change a role's admin, use {AccessControl-_setRoleAdmin}.
    function _setRoleAdmin(bytes32 target_role, bytes32 new_admin_role) external adminRequired(target_role)
    {
        bytes32 previousAdmin = roles[target_role].adminRole ;
        roles[target_role].adminRole = new_admin_role;
        emit RoleAdminChanged(target_role, previousAdmin, new_admin_role);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) public adminRequired(role)
    {
        if(roles[role].members[account] == false)
        {
            roles[role].members[account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external adminRequired(role)
    {
        if(roles[role].members[account] == true)
        {
            roles[role].members[account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external selfRequired(account)
    {
        if(roles[role].members[account] == true)
        {
            roles[role].members[account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }
}
