import app.models as models

def userEntity(user: models.UserDocument) -> dict:
    return {
        "uuid": str(user.uuid),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        # "role": user["role"],
        "avatar": user.avatar,
        "email_verified": user.email_verified,
        "created_at": user.created_at,
        "updated_at": user.updated_at,

        "otp_enabled": user.otp_enabled,
        "otp_verified": user.otp_verified,
    }



def userResponseEntity(user: models.UserDocument) -> dict:
    return {
        "uuid": str(user.uuid),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        # "role": user["role"],
        "avatar": user.avatar,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }


def embeddedUserResponse(user: models.UserDocument) -> dict:
    return {
        "uuid": str(user.uuid),
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "avatar": user.avatar
    }


def userListEntity(users) -> list:
    return [userEntity(user) for user in users]
