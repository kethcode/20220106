import chai, { expect } from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'
import { Contract, Signer } from 'ethers'
chai.use(solidity)

describe('AccessControl',() => {

  let SoladayAccessControl: Contract

  before(async () => {
    const factory = await ethers.getContractFactory('SoladayAccessControl')
    SoladayAccessControl = await factory.deploy()
  })

  describe('construction', () => {

    it('the default admin role should be 0x00..00', async() => {
      let defaultAdminRoleValue = await SoladayAccessControl.DEFAULT_ADMIN_ROLE()
      expect(defaultAdminRoleValue).to.hexEqual('0x00')
    })

    it('should give the deployer the default admin role', async() => {
      // K: You can use hasRole here.
      // D: I don't think I can. There's nothing in the spec that says a role admin must also be a role member.
      // D: Nope, you were right. They are Admin and Member of the default admin role.
      // D: ok, so I was assiging role admin to an account.  this makes more sense when it is assigned to a role.
      let defaultAdminRoleValue = await SoladayAccessControl.DEFAULT_ADMIN_ROLE()
      let [deployer] = await ethers.getSigners()
      let deployerRole = await SoladayAccessControl.hasRole(defaultAdminRoleValue, deployer.address);
      expect(deployerRole).to.be.true
    })

    it('the admin of the default admin role is the default admin role', async() => {
      // K: You can use getRoleAdmin here.
      let defaultAdminRoleValue = await SoladayAccessControl.DEFAULT_ADMIN_ROLE()
      let adminRoleAdminRole = await SoladayAccessControl.getRoleAdmin(defaultAdminRoleValue);
      expect(adminRoleAdminRole).to.hexEqual(defaultAdminRoleValue)
    })

    it('the admin of any other role is the default admin role', async() => {
      // You can use getRoleAdmin here.
      let defaultAdminRoleValue = await SoladayAccessControl.DEFAULT_ADMIN_ROLE()
      let userRoleValue = await SoladayAccessControl.USER_ROLE()
      let userRoleAdminRole = await SoladayAccessControl.getRoleAdmin(userRoleValue);
      expect(userRoleAdminRole).to.hexEqual(defaultAdminRoleValue)
    })
    
  })

  describe('grantRole', () => {
    describe('when the sender has the admin role for the given role', () => {
      describe('when the target does not have the role', () => {
        it('should grant the role to the address', async() => {
          // You can use hasRole here.
          let accounts = await ethers.getSigners()
          let target = accounts[1];
          let userRoleValue = await SoladayAccessControl.USER_ROLE()

          await SoladayAccessControl.grantRole(userRoleValue, target.address);
          let hasUserRole = await SoladayAccessControl.hasRole(userRoleValue, target.address);
          expect(hasUserRole).to.be.true

        })

        it('should emit a RoleGranted event', async() => {})
      })

      describe('when the target has the role', () => {
        it('should succeed but not emit a RoleGranted event', async() => {})
      })
    })

    describe('when the sender does not have the admin role for the given role', () => {
      it('should revert with a clear error', async() => {})
    })
  })

  describe('revokeRole', () => {
    describe('when the sender has the admin role for the given role', () => {
      describe('when the target does not have the role', () => {
        it('should succeed but not emit a RoleRevoked event', async() => {})
      })

      describe('when the target has the role', () => {
        it('should revoke the role', async() => {})

        it('should emit a RoleRevoked event', async() => {})
      })
    })

    describe('when the sender does not have the admin role for the given role', () => {
      it('should revert with a clear error', async() => {})
    })
  })

  describe('renounceRole', () => {
    describe('when the target is not the sender', () => {
      it('should revert with a clear error', async() => {})
    })

    describe('when the target is the sender', () => {
      describe('when the user has the role being renounced', () => {
        it('should emit a RoleRevoked event', async() => {})
      })

      describe('when the user does not have the role being renounced', () => {
        it('should not emit a RoleRevoked event', async() => {})
      })
    })
  })
})