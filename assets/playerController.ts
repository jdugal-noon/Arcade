import { __private, _decorator, Component, EventKeyboard, game, input, Input, KeyCode, Node, RigidBody, System, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;


// make a car controller
// this is to contol the player car 
@ccclass('playerController')
export class playerController extends Component {
   @property(RigidBody)
   public rigidBody: RigidBody = null;

   // Input states
   private accelationInput : number = 0;
   private steeringInput : number = 0;
   
   // Car physics properties
   @property()
   private currentSpeed: number = 0;
   @property()
   private maxSpeed: number = 20;
    @property()
   private acceleration: number = 8;
      @property()
   private deceleration: number = 12;
      @property()
   private brakeForce: number = 15;
      @property()
   private turnRadius: number = 5; // Higher values = wider turning radius
      @property()
   private minTurnSpeed: number = 2; // Minimum speed needed for turning  

   protected onLoad(): void {
       // Inpuyt System Init
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
   }

   private onKeyDown(event: EventKeyboard) {
         switch(event.keyCode) {
            case KeyCode.KEY_W: 
                this.accelationInput = 1;
                break;
            case KeyCode.KEY_S:
                this.accelationInput = -1;
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
        this.updateSpeed(dt);
        this.updateMovement(dt);
        this.updateSteering(dt);
    }

    private updateSpeed(dt: number): void {
        // Handle acceleration and deceleration
        if (this.accelationInput > 0) {
            // Accelerating forward
            this.currentSpeed += this.acceleration * dt;
            this.currentSpeed = Math.min(this.currentSpeed, this.maxSpeed);
        } else if (this.accelationInput < 0) {
            // Braking/reversing
            if (this.currentSpeed > 0) {
                // Apply braking
                this.currentSpeed -= this.brakeForce * dt;
                this.currentSpeed = Math.max(this.currentSpeed, 0);
            } else {
                // Reverse
                this.currentSpeed -= this.acceleration * dt;
                this.currentSpeed = Math.max(this.currentSpeed, -this.maxSpeed * 0.5); // Half speed in reverse
            }
        } else {
            // Natural deceleration when no input
            if (this.currentSpeed > 0) {
                this.currentSpeed -= this.deceleration * dt;
                this.currentSpeed = Math.max(this.currentSpeed, 0);
            } else if (this.currentSpeed < 0) {
                this.currentSpeed += this.deceleration * dt;
                this.currentSpeed = Math.min(this.currentSpeed, 0);
            }
        }
    }

    private updateMovement(dt: number): void {
        // Apply forward/backward movement
        if (Math.abs(this.currentSpeed) > 0.1) {
            const forwardForce = new Vec3(0, 0, this.currentSpeed * 200);
            this.rigidBody.applyLocalForce(forwardForce, new Vec3(0, 0, 0));
        }
    }

    private updateSteering(dt: number): void {
        // Only turn if we have steering input and sufficient speed
        if (this.steeringInput !== 0 && Math.abs(this.currentSpeed) > this.minTurnSpeed) {
            // Calculate turn rate based on speed - slower speeds allow tighter turns
            const speedFactor = Math.abs(this.currentSpeed) / this.maxSpeed;
            const turnRate = (1.0 - speedFactor * 0.7) / this.turnRadius; // Tighter turns at lower speeds
            
            // Apply turning torque proportional to current speed
            const turnTorque = this.steeringInput * turnRate * Math.abs(this.currentSpeed) * 100;
            const torque = new Vec3(0, turnTorque, 0);
            this.rigidBody.applyLocalTorque(torque);
        }
    }

}

