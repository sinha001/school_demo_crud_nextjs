"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import styles from "@/styles/school-form.module.css"

export default function SchoolForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm()

  const [serverMessage, setServerMessage] = useState(null)
  const [serverError, setServerError] = useState(null)

  const onSubmit = async (data) => {
    setServerMessage(null)
    setServerError(null)

    async function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    let imageDataUrl = ""
    if (data.image && data.image[0]) {
      try {
        imageDataUrl = await readFileAsDataUrl(data.image[0])
      } catch (e) {
        setServerError("Failed to read image file")
        return
      }
    }

    const payload = {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      contact: data.contact,
      email_id: data.email_id,
      imageDataUrl,
    }

    try {
      const res = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setServerError(json.error || "Failed to add school")
      } else {
        setServerMessage("School added successfully.")
        reset()
      }
    } catch (e) {
      setServerError(e?.message || "Network error")
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h1 className={styles.title}>Add School</h1>

      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="School Name"
          aria-invalid={!!errors.name}
          {...register("name", { required: "Name is required", minLength: { value: 2, message: "Min 2 characters" } })}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          placeholder="Street, Area"
          aria-invalid={!!errors.address}
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && <span className={styles.error}>{errors.address.message}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            placeholder="City"
            aria-invalid={!!errors.city}
            {...register("city", { required: "City is required" })}
          />
          {errors.city && <span className={styles.error}>{errors.city.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            placeholder="State"
            aria-invalid={!!errors.state}
            {...register("state", { required: "State is required" })}
          />
          {errors.state && <span className={styles.error}>{errors.state.message}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact">Contact</label>
          <input
            id="contact"
            type="tel"
            placeholder="Phone Number"
            aria-invalid={!!errors.contact}
            {...register("contact", {
              required: "Contact is required",
              pattern: { value: /^[0-9\s+\-()]{7,15}$/, message: "Use 7-15 digits (+ - ( ) space allowed)" },
            })}
          />
          {errors.contact && <span className={styles.error}>{errors.contact.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="email_id">Email</label>
          <input
            id="email_id"
            type="email"
            placeholder="email@example.com"
            aria-invalid={!!errors.email_id}
            {...register("email_id", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email_id && <span className={styles.error}>{errors.email_id.message}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="image">School Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          aria-invalid={!!errors.image}
          {...register("image", { required: "Please upload an image" })}
        />
        {errors.image && <span className={styles.error}>{String(errors.image.message)}</span>}
        <small className={styles.help}>Accepted: JPG, PNG, WEBP, GIF.</small>
      </div>

      {serverMessage && <div className={styles.success}>{serverMessage}</div>}
      {serverError && <div className={styles.errorBanner}>{serverError}</div>}

      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save School"}
      </button>
    </form>
  )
}
