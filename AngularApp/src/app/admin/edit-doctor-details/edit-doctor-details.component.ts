import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DoctorService } from 'src/app/services/doctor.service';
import { Location } from '@angular/common'
import { AdminService } from 'src/app/services/admin.service';
import { PharmacistService } from 'src/app/services/pharmacist.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-doctor-details',
  templateUrl: './edit-doctor-details.component.html',
  styleUrls: ['./edit-doctor-details.component.css']
})
export class EditDoctorDetailsComponent implements OnInit {
  admindata:any=[]
  doctor=new FormGroup({
    title:new FormControl(''),
    fullname:new FormControl(''),
    email:new FormControl(''),
    phone:new FormControl(''),
    age:new FormControl(''),
    currentCity:new FormControl(''),
    currentHospital:new FormControl(''),
    maritalStatus:new FormControl(''),
    personalAdditional:new FormControl(''),
    degree:new FormControl(''),

    edulevel:new FormControl(''),
    eduAdditional:new FormControl(''),
    displayImage:new FormControl(''),
    SLMC:new FormControl(''),
    ex:new FormControl(''),
    position:new FormControl(''),
    type:new FormControl(''),


  })
  imageData:string='';
  oldimage:string='';
  imagename:string="";
  image:any;
  isImageselected:boolean=false;
  data:any=[];
  cancel:boolean=false;
  constructor(
    private doctorService:DoctorService,
    public toastr:ToastrService,
    public router:Router,
    public route:ActivatedRoute,
    private auth:AuthenticationService,
    private location: Location,
    private admin:AdminService,
    private pharmacyService:PharmacistService

  ) { }

  logout(){

    this.auth.logout();
      }

  ngOnInit(): void {
    this.isImageselected=false;
    this.imageData="../../../assets/add-doctor/nopic.png";
    setTimeout(()=>{

      this.doctorService.getoneDoctor(this.route.snapshot.params.id).subscribe(
        res=>{
          this.data=res;
          this.imageData=res.displayImage;
          this.oldimage=res.displayImage;
          console.log(this.oldimage)
          console.log(res.displayImage)
          this.doctor.get('title')?.setValue(res.title);
          this.doctor.get('fullname')?.setValue(res.fullname);
          this.doctor.get('email')?.setValue(res.email);
          this.doctor.get('phone')?.setValue(res.phone);
          this.doctor.get('age')?.setValue(res.age);
          this.doctor.get('currentCity')?.setValue(res.currentCity);
          this.doctor.get('currentHospital')?.setValue(res.currentHospital);
          this.doctor.get('maritalStatus')?.setValue(res.maritalStatus);
          this.doctor.get('personalAdditional')?.setValue(res.personalAdditional);
          this.doctor.get('degree')?.setValue(res.degree);
          this.doctor.get('edulevel')?.setValue(res.edulevel);
          this.doctor.get('eduAdditional')?.setValue(res.eduAdditional);
          this.doctor.get('displayImage')?.setValue(res.displayImage);
          this.doctor.get('SLMC')?.setValue(res.SLMC);
          this.doctor.get('ex')?.setValue(res.ex);
          this.doctor.get('position')?.setValue(res.position);
          this.doctor.get('type')?.setValue(res.type);
        }
      );

      this.admin.getAdmin().subscribe(res=>{
        this.admindata=res;
      });

    });

  }
  addPhamasisit(){
    Swal.fire({
      showDenyButton: true,
      denyButtonText: 'No',
      allowOutsideClick: false,
      title: 'Assign New Pharmacist',
      html: `
      <input type="text"  name="name" class="swal2-input" placeholder="Pharmacist Name">
      <input type="email"  name="email" class="swal2-input" placeholder="Pharmacist Email">
      <input type="password"  name="password" class="swal2-input" placeholder="Type a Password">`,
      confirmButtonText: 'Assign',
      preDeny:()=>{
        this.cancel=true;
        console.log("dfdf")
      },

      preConfirm: () => {
        const name =  Swal.getPopup()?.getElementsByTagName('input').namedItem('name')?.value
        const email =  Swal.getPopup()?.getElementsByTagName('input').namedItem('email')?.value
        const password = Swal.getPopup()?.getElementsByTagName('input').namedItem('password')?.value
        if (!email || !password || !name) {
          Swal.showValidationMessage(`Please enter login and password`)
        }
        return {name:name, email: email, password: password }
      }

    }).then((result) => {
      console.log(result.value)
      if(!this.cancel){
      this.pharmacyService.addPharmacist(result.value).subscribe((res)=>{
        Swal.fire(
          'Success!',
          'New Pharmacist Assigned',
          'success'
        )
      })
    }

    }).catch((reason)=>{
      console.log(reason)
    }).finally(()=>{
      this.cancel=false;
    })

  }

  addDoctor(doctor:any){
    if(this.isImageselected){

      this.doctorService.updateDoctor(doctor, this.route.snapshot.params.id).subscribe(res=>{
          this.toastr.success("Update Successfully", "Updating Doctor");

          this.uploadImage(this.route.snapshot.params.id);
          setTimeout(()=>{
            this.router.navigate(['Admin-dashboard']);
          });




      });


    }else{
      doctor.displayName=this.oldimage;
      this.doctorService.updateDoctor(doctor, this.route.snapshot.params.id).subscribe(res=>{
          this.toastr.success("Update Successfully", "Updating Doctor");


          this.location.back();



      });
    }





  }
  removeDoctor(value:any){
    const c = this.data._id;
    this.doctorService.deleteDoctor(c).subscribe(res=>{
      this.toastr.success("Deleting Successfully", "Delete Doctor");

      this.router.navigate(['Admin-dashboard']);
    })
  }
  toast(message:String) {
    this.toastr.warning(message.toString(), "Adding Doctor");
   }

  onFileSelect(event : Event){
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.image=file;

    const allowedFileTypes=["image/png", "image/jpeg", "image/jpg"];
    if(this.image && allowedFileTypes.includes(this.image.type)){
      const reader=new FileReader();
      reader.onload = () => {
        this.imageData=reader.result as string;
        this.imagename=this.image.name;
        console.log(this.imagename)
        if(file){
          this.isImageselected=true;
          }
          console.log("has image " + this.isImageselected)

      }
      reader.readAsDataURL(this.image);
    }
  }


  uploadImage(id:string){

    let fd=new FormData();
    if(this.image){
      fd.append("doctorImage", this.image, this.image.name);
      console.log(this.oldimage)
      this.doctorService.updateImage(id,fd).subscribe((res)=>{
        console.log(res);

      })
    }
  }
}
