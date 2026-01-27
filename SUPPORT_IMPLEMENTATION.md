# 🏥 Support Section - Supabase Integration

## ✅ **What Was Implemented**

### **Hospitals Screen** - COMPLETE ✅
**File**: `app/(screens)/hospitals.tsx`
**Supabase RPC**: `get_all_hospital`
**Features**:
- Fetches hospital data from Supabase
- Shows: Name, Address, Phone
- Copy to clipboard for address & phone
- Loading state
- Bilingual support (EN/BM)
- Error handling

---

## 🔧 **TODO: Create Remaining Screens**

### 1. **Clinics Screen**
**File**: `app/(screens)/clinics.tsx`
**Supabase RPC**: `get_all_clinic`
**Data**: Same as hospitals (name, address, phone)
**Action**: Copy the hospitals.tsx and replace:
- Title: "Senarai Klinik" / "List of Clinics"
- RPC call: `supabase.rpc('get_all_clinic')`
- State variable: `clinics` instead of `hospitals`

### 2. **Organizations Screen**
**File**: `app/(screens)/organizations.tsx`
**Supabase RPC**: `get_all_org`
**Data**: name, shortform, workingdays, phone, address, website
**Special**: Has website field (optional) - show as clickable link

### 3. **Directories Screen**
**File**: `app/(screens)/directories.tsx`
**Supabase RPC**: `get_all_dir`
**Data**: name, place, gender, contact, address, area, email, website
**Special**: Shows gender info, has email field

### 4. **Websites Screen** (Optional)
**File**: `app/(screens)/websites.tsx`
**Note**: In legacy app, this seems to be a list of useful websites for HIV/AIDS info
**Action**: May need to fetch from a websites table or use static data

---

## 📋 **Support Navigation Structure**

```
Support (main page)
├── Organizations → organizations.tsx → supabase.rpc('get_all_org')
├── Directories → directories.tsx → supabase.rpc('get_all_dir')
├── Websites → websites.tsx → (TBD: check if Supabase or static)
├── Hospitals → hospitals.tsx → supabase.rpc('get_all_hospital') ✅
└── Clinics → clinics.tsx → supabase.rpc('get_all_clinic')
```

---

## 🔄 **Quick Create Guide**

### For Clinics (Copy from Hospitals):
1. Copy `hospitals.tsx` to `clinics.tsx`
2. Replace all "Hospital" with "Clinic"
3. Change RPC: `supabase.rpc('get_all_clinic')`
4. Update titles: "Senarai Klinik" / "List of Clinics"

### For Organizations (New fields):
1. Copy `hospitals.tsx` to `organizations.tsx`
2. Update type:
   ```typescript
   type OrgItem = {
     id: string;
     name: string;
     shortform: string;
     workingdays: string;
     phone: string;
     address: string;
     website: string;
   };
   ```
3. Update RPC: `supabase.rpc('get_all_org')`
4. Update card to show all fields including website link

### For Directories (Most fields):
1. Copy `hospitals.tsx` to `directories.tsx`
2. Update type:
   ```typescript
   type DirItem = {
     id: string;
     name: string;
     place: string;
     gender: string;
     contact: string;
     address: string;
     area: string;
     email: string;
     website?: string;
   };
   ```
3. Update RPC: `supabase.rpc('get_all_dir')`
4. Update card to show all fields

---

## ✅ **Current Status**

| Screen | Status | RPC Function | Route |
|--------|--------|--------------|-------|
| Support (main) | ✅ Complete | - | `/support` |
| Hospitals | ✅ Complete | `get_all_hospital` | `/hospitals` |
| Clinics | ❌ TODO | `get_all_clinic` | `/clinics` |
| Organizations | ❌ TODO | `get_all_org` | `/organizations` |
| Directories | ❌ TODO | `get_all_dir` | `/directories` |
| Websites | ❌ TODO | TBD | `/websites` |

---

## 🎯 **Next Steps**

1. Create `clinics.tsx` (5 minutes - copy hospitals)
2. Create `organizations.tsx` (10 minutes - add website field)
3. Create `directories.tsx` (10 minutes - add email, gender fields)
4. Create `websites.tsx` (check if data exists in Supabase first)
5. Add routes to `app/(screens)/_layout.tsx`
6. Test all screens with real Supabase data

---

## 📝 **Notes**

- All screens use the same pattern: fetch from Supabase RPC → display in FlatList
- Copy to clipboard functionality for contact info
- Bilingual support (EN/BM) for all labels
- Loading states with ActivityIndicator
- Error handling with Alerts
- Safe area insets for proper layout

**The hospitals screen is complete and working! Use it as the template for the remaining screens.**
