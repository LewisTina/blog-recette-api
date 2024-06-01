import InputTextField from "@/components/ui/InputTextField";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import styles from './form.module.scss'
import InputTextArea from "@/components/ui/InputTextField/InputTextArea";
import CustomButton from "@/components/ui/button/CustomButton";
import { useRecipe } from "@/hooks/recipe";
import { useMutation } from "react-query";
import CustomSelect from "@/components/ui/InputTextField/select";
import IconButton from "@/components/ui/icon_button";
import { useState } from "react";
import { readFilesAsBase64 } from "@/utils";

export default function RecipeForm() {
    const params = useParams()
    const { register, handleSubmit, formState: {errors}, unregister } = useForm();
    const [ingredients, setIngredients] = useState<string[]>(["0_0000"])
    const { createRecipe } = useRecipe()

    const addFormBlock = (i:number) => {
        const newList = [...ingredients]; 
        const now = new Date()
        let id = now.getTime()
        newList.splice(i, 0, `${id}_0000`)
        setIngredients(newList);
    }

    let removeFormBlock = (i:number, productId: string | number) => {
        let newList = [...ingredients]
        unregister(`ingredients[${productId}]`)
        newList.splice(i, 1);
        setIngredients(newList);
    }

    const {
      isLoading,
      mutateAsync
      } = useMutation(createRecipe)

    const onSubmit = async (d: any) => {
        const selectedFiles: FileList = d.files
        type base64 = string | ArrayBuffer | null
        let base64_files: base64[] = []

        if(selectedFiles) {
            await readFilesAsBase64(selectedFiles).then((base64Files: string[]) => {
                let val: base64[] = []
                Array.from(selectedFiles).map((file, index) => (
                    val.push(base64Files[index])
                ))
                base64_files = val
            })
        }

        const postData = {
            ...d,
            files: base64_files
        }

        console.log(postData)

        await mutateAsync(postData)
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h1>
                {"Ajouter une recette"}
            </h1>
            <InputTextField
                placeholder={('Nom de la recette')} 
                controller={register} 
                formError={errors}
                label={"Titre"}
                autoComplete='off'
                name={'title'}/>
            <InputTextField
                controller={register} 
                formError={errors}
                label={"Images"}
                multiple
                type="file"
                accept=".jpg,.jpeg,.png"
                name={'files'}/>

            {
                ingredients.map((e, index) => {
                    return (
                        <div className={styles.ingredient} key={e}>
                            <InputTextField
                                controller={register} 
                                formError={errors}
                                label={"Ingrédient"}
                                multiple
                                name={`ingredients[${e}].title`}/>
                            <InputTextField
                                controller={register} 
                                formError={errors}
                                label={"Quantité"}
                                multiple
                                type="number"
                                name={`ingredients[${e}].quantity`}/>
                            <CustomSelect 
                                name={`ingredients[${e}].unit`}
                                label={"Unité"} 
                                controller={register}>
                                    <option value="-">--</option>
                                    <option value="g">g</option>
                                    <option value="cl">cl</option>
                                    <option value="cas">Cuillère à soupe</option>
                                    <option value="pk">Paquet</option>
                            </CustomSelect>
                            <div className="flex gap-4">
                                <IconButton 
                                    icon={'XMarkIcon'}
                                    onClick={() => removeFormBlock(index, e)}
                                    disabled ={ingredients.length > 1 ? false : true}
                                    size="large"
                                    className='bg-red-500 text-white w-12 my-1'/>
                                <IconButton 
                                    icon={'PlusIcon'}
                                    onClick={() => addFormBlock(index + 1)}
                                    size="large"
                                    className='bg-green-600 text-white w-12 my-1'/>
                            </div>
                        </div>
                    )
                })
            }

            <InputTextArea
                placeholder={('Description courte de la recette')} 
                controller={register} 
                label={"Description"}
                autoComplete='off'
                name={'description'}/>

            <CustomButton 
                type='submit'
                theme='primary'
                size='full'
                isLoading={isLoading}
                label={'Enregistrer'}/>
        </form>
    )
}