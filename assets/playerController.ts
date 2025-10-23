import { __private, _decorator, Component, EventKeyboard, game, input, Input, KeyCode, Node, RigidBody, System, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('playerController')
export class playerController extends Component {
   @property(RigidBody)
   public rigidBody: RigidBody = null;

   private accelationInput : number = 0;
   private steeringInput : number = 0;  

   protected onLoad(): void {
       // Inpuyt System Init
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
   }

   private onKeyDown(event: EventKeyboard) {
         switch(event.keyCode) {
            case KeyCode.KEY_W: 
                this.accelationInput = -1;
                break;
            case KeyCode.KEY_S:
                this.accelationInput = 1;
                break;
            case KeyCode.KEY_A:
                this.steeringInput = 1;
                break;
            case KeyCode.KEY_D:
                this.steeringInput = -1;
                break;
         }
   }

    private onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {    
            case KeyCode.KEY_W:
                this.accelationInput = 0;
                break;
            case KeyCode.KEY_S:
                this.accelationInput = 0;
                break;
            case KeyCode.KEY_A:
                this.steeringInput = 0;
                break;
            case KeyCode.KEY_D:
                this.steeringInput = 0;
                break;
        }

    }

    protected lateUpdate(dt: number): void {
        // fixed update call 

        const force = 500 * this.accelationInput;
        const torque = 150 * this.steeringInput;

        let v = new Vec3(); 
        
        this.rigidBody.getLinearVelocity(v);

        let mag= v.length(); 

        

        this.rigidBody.applyForce(this.node.forward.multiplyScalar(force), this.node.forward);
        this.rigidBody.applyTorque(this.node.up.multiplyScalar(torque));
        
    }

}

